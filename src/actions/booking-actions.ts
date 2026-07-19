"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { canManageWorkspace } from "@/lib/permissions";
import { defaultSchedulingConfiguration } from "@/lib/services/scheduling/scheduling-configuration";
import {
  createBookingCalendarEvent,
  deleteBookingCalendarEvent,
  updateBookingCalendarEvent,
} from "@/lib/services/booking/calendar-service";
import {
  minutesToTime,
  timeToMinutes,
} from "@/lib/services/booking/availability-service";
import {
  sendBookingConfirmation,
  sendBookingRescheduled,
} from "@/lib/services/booking/email-service";
import {
  createBookingSchema,
  rescheduleBookingSchema,
  updateBookingStatusSchema,
} from "@/lib/validation/booking";
import { schedulingEngine } from "@/lib/services/scheduling/scheduling-engine";
import { bookingRuleRepository } from "@/lib/repositories/booking-rule-repository";

async function getWorkspaceId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
    },
  });

  return user?.workspaceId;
}

function buildBookingDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export async function createBookingAction(formData: FormData) {
  const input = createBookingSchema.parse({
    serviceId: formData.get("serviceId"),
    workspaceId: formData.get("workspaceId"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
  });

  const service = await prisma.service.findFirst({
    where: {
      id: input.serviceId,
      workspaceId: input.workspaceId,
      active: true,
    },
  });

  if (!service) {
    return;
  }

  const bookingDate = buildBookingDateTime(input.date, "00:00");

  const bookingStartDateTime = buildBookingDateTime(
    input.date,
    input.startTime,
  );

  const endTime = minutesToTime(
    timeToMinutes(input.startTime) + service.duration,
  );

  const bookingRules = await bookingRuleRepository.getWorkspaceRules(
    input.workspaceId,
  );

  const schedulingDecision = await schedulingEngine.process({
    workspaceId: input.workspaceId,
    serviceId: input.serviceId,
    servicePrice: service.price,
    configuration: defaultSchedulingConfiguration,
    bookingDate: bookingStartDateTime,
    bookingStartTime: input.startTime,
    bookingEndTime: endTime,
    isNewClient: true,
    isVip: false,
    existingBookingsToday: 0,
    bookingRules,
  });

  if (!schedulingDecision.allowed) {
    console.warn("Booking rejected by scheduling engine", {
      workspaceId: input.workspaceId,
      serviceId: input.serviceId,
      reasons: schedulingDecision.reasons,
    });

    return;
  }

  if (!schedulingDecision.deposit) {
    throw new Error("Scheduling deposit calculation did not complete");
  }

  const deposit = schedulingDecision.deposit;
  const bookingEndDateTime = buildBookingDateTime(input.date, endTime);

  console.log("Deposit calculation", deposit);

  const booking = await prisma.booking.create({
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone ?? null,
      notes: input.notes ?? null,
      date: bookingDate,
      startTime: input.startTime,
      endTime,
      serviceId: input.serviceId,
      workspaceId: input.workspaceId,
    },
    include: {
      service: true,
      workspace: true,
    },
  });

  await sendBookingConfirmation({
    email: booking.customerEmail,
    customerName: booking.customerName,
    businessName:
      booking.workspace.companyName || booking.workspace.name || "Vellum",
    serviceName: booking.service.name,
    bookingDate: booking.date.toLocaleDateString(),
    bookingTime: `${booking.startTime}–${booking.endTime}`,
  });

  const calendarEvent = await createBookingCalendarEvent({
    summary: `${booking.service.name} with ${booking.customerName}`,
    description: booking.notes || undefined,
    startDateTime: bookingStartDateTime,
    endDateTime: bookingEndDateTime,
    attendeeEmail: booking.customerEmail,
  });

  if (calendarEvent?.id) {
    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        googleCalendarEventId: calendarEvent.id,
      },
    });
  }

  const workspaceAdmin = await prisma.user.findFirst({
    where: {
      workspaceId: input.workspaceId,
      role: {
        in: ["OWNER", "ADMIN"],
      },
    },
    select: {
      id: true,
    },
  });

  if (workspaceAdmin) {
    await prisma.notification.create({
      data: {
        userId: workspaceAdmin.id,
        title: "New booking created",
        message: `${booking.customerName} booked ${booking.service.name} for ${booking.date.toLocaleDateString()} at ${booking.startTime}.`,
        type: "BOOKING",
        href: `/bookings/${booking.id}`,
      },
    });
  }

  redirect(`/booking-confirmation/${booking.id}`);
}

export async function updateBookingStatusAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const input = updateBookingStatusSchema.parse({
    bookingId: formData.get("bookingId"),
    status: formData.get("status"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      id: input.bookingId,
      workspaceId,
    },
    select: {
      id: true,
      googleCalendarEventId: true,
    },
  });

  if (!existingBooking) {
    return;
  }

  if (input.status === "CANCELLED" && existingBooking.googleCalendarEventId) {
    await deleteBookingCalendarEvent(existingBooking.googleCalendarEventId);
  }

  await prisma.booking.update({
    where: {
      id: existingBooking.id,
    },
    data: {
      status: input.status,
      googleCalendarEventId:
        input.status === "CANCELLED"
          ? null
          : existingBooking.googleCalendarEventId,
    },
  });

  if (input.status === "CANCELLED") {
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Booking cancelled",
        message:
          "A booking was cancelled and removed from the active calendar.",
        type: "BOOKING",
        href: `/bookings/${existingBooking.id}`,
      },
    });
  }

  redirect("/bookings");
}

export async function rescheduleBookingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const input = rescheduleBookingSchema.parse({
    bookingId: formData.get("bookingId"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: input.bookingId,
      workspaceId,
    },
    include: {
      service: true,
      workspace: true,
    },
  });

  if (!booking) {
    return;
  }

  const endTime = minutesToTime(
    timeToMinutes(input.startTime) + booking.service.duration,
  );

  const bookingDate = buildBookingDateTime(input.date, "00:00");

  const bookingStartDateTime = buildBookingDateTime(
    input.date,
    input.startTime,
  );

  const bookingRules =
    await bookingRuleRepository.getWorkspaceRules(workspaceId);

  const schedulingDecision = await schedulingEngine.process({
    workspaceId,
    serviceId: booking.serviceId,
    servicePrice: booking.service.price,
    configuration: defaultSchedulingConfiguration,
    bookingDate: bookingStartDateTime,
    bookingStartTime: input.startTime,
    bookingEndTime: endTime,
    isNewClient: false,
    isVip: false,
    existingBookingsToday: 0,
    bookingRules,
    excludeBookingId: booking.id,
  });

  if (!schedulingDecision.allowed) {
    console.warn("Booking reschedule rejected by scheduling engine", {
      bookingId: booking.id,
      workspaceId,
      reasons: schedulingDecision.reasons,
    });

    return;
  }
  const updatedBooking = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      date: bookingDate,
      startTime: input.startTime,
      endTime,
      status: "CONFIRMED",
    },
    include: {
      service: true,
      workspace: true,
    },
  });

  const startDateTime = bookingStartDateTime;

  const endDateTime = buildBookingDateTime(input.date, endTime);

  await updateBookingCalendarEvent({
    eventId: updatedBooking.googleCalendarEventId,
    summary: `${updatedBooking.service.name} with ${updatedBooking.customerName}`,
    description: updatedBooking.notes,
    startDateTime,
    endDateTime,
    attendeeEmail: updatedBooking.customerEmail,
  });

  await sendBookingRescheduled({
    email: updatedBooking.customerEmail,
    customerName: updatedBooking.customerName,
    businessName:
      updatedBooking.workspace.companyName ?? updatedBooking.workspace.name,
    serviceName: updatedBooking.service.name,
    bookingDate: updatedBooking.date.toLocaleDateString(),
    bookingTime: `${updatedBooking.startTime} – ${updatedBooking.endTime}`,
  });

  await prisma.notification.create({
    data: {
      userId: session.user.id,
      title: "Booking rescheduled",
      message: `${updatedBooking.customerName}'s ${updatedBooking.service.name} booking was moved to ${updatedBooking.date.toLocaleDateString()} at ${updatedBooking.startTime}.`,
      type: "BOOKING",
      href: `/bookings/${updatedBooking.id}`,
    },
  });

  redirect(`/bookings/${updatedBooking.id}`);
}
