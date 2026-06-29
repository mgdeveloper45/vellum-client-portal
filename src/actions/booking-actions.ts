"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { canManageWorkspace } from "@/lib/permissions";
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

function addMinutesToTime(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);

  return date.toTimeString().slice(0, 5);
}

export async function createBookingAction(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "").trim();
  const workspaceId = String(formData.get("workspaceId") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerEmail = String(formData.get("customerEmail") ?? "").trim();
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();

  if (
    !serviceId ||
    !workspaceId ||
    !customerName ||
    !customerEmail ||
    !date ||
    !startTime
  ) {
    return;
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
      workspaceId,
    },
  });

  if (!service || !service.active) {
    return;
  }

  const endTime = minutesToTime(timeToMinutes(startTime) + service.duration);

  const booking = await prisma.booking.create({
    data: {
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      notes: notes || null,
      date: new Date(`${date}T00:00:00`),
      startTime,
      endTime,
      serviceId,
      workspaceId,
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

  const bookingStartDateTime = new Date(`${date}T${startTime}:00`);
  const bookingEndDateTime = new Date(`${date}T${endTime}:00`);

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

  redirect(`/booking-confirmation/${booking.id}`);
}

export async function updateBookingStatusAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (
    !bookingId ||
    !["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
  ) {
    return;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      workspaceId: currentUser.workspaceId,
    },
    select: {
      id: true,
      googleCalendarEventId: true,
    },
  });

  if (!existingBooking) {
    return;
  }

  if (status === "CANCELLED" && existingBooking.googleCalendarEventId) {
    await deleteBookingCalendarEvent(existingBooking.googleCalendarEventId);
  }

  await prisma.booking.update({
    where: {
      id: existingBooking.id,
    },
    data: {
      status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
      googleCalendarEventId:
        status === "CANCELLED" ? null : existingBooking.googleCalendarEventId,
    },
  });

  redirect("/bookings");
}

export async function rescheduleBookingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();

  if (!bookingId || !date || !startTime) {
    return;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      workspaceId: currentUser.workspaceId,
    },
    include: {
      service: true,
      workspace: true,
    },
  });

  if (!booking) {
    return;
  }

  const endTime = addMinutesToTime(startTime, booking.service.duration);

  const updatedBooking = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      date: new Date(`${date}T00:00:00`),
      startTime,
      endTime,
      status: "CONFIRMED",
    },
    include: {
      service: true,
      workspace: true,
    },
  });

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

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

  redirect(`/bookings/${updatedBooking.id}`);
}
