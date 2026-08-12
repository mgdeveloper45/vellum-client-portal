"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProjects, canManageWorkspace } from "@/lib/permissions";
import { createProjectFromBookingService } from "@/lib/services/booking/composition/booking-services";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createBookingCalendarEvent,
  deleteBookingCalendarEvent,
  updateBookingCalendarEvent,
} from "@/lib/services/booking/calendar-service";
import {
  createBookingService,
  rescheduleBookingService,
  updateBookingStatusService,
} from "@/lib/services/booking/composition/booking-services";
import {
  sendBookingConfirmation,
  sendBookingRescheduled,
} from "@/lib/services/booking/email-service";
import { prismaBookingWorkflowRepository } from "@/lib/services/booking/prisma-booking-workflow-repository";
import {
  createBookingSchema,
  rescheduleBookingSchema,
  updateBookingStatusSchema,
} from "@/lib/validation/booking";
import { redirect } from "next/navigation";

function buildBookingDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export async function createBookingAction(formData: FormData) {
  const parsed = createBookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    workspaceId: formData.get("workspaceId"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
  });

  if (!parsed.success) {
    console.error("Booking form validation failed", {
      issues: parsed.error.flatten(),
    });

    return;
  }

  const input = parsed.data;

  const result = await createBookingService.execute(input);

  if (!result.success || !result.bookingId) {
    console.error("Booking creation failed", {
      code: result.code,
      reasons: result.reasons,
      workspaceId: input.workspaceId,
      serviceId: input.serviceId,
      date: input.date,
      startTime: input.startTime,
    });

    return;
  }

  const booking = await prismaBookingWorkflowRepository.findBookingForWorkflow({
    bookingId: result.bookingId,
    workspaceId: input.workspaceId,
  });

  if (!booking) {
    console.error("Created booking could not be reloaded", {
      bookingId: result.bookingId,
      workspaceId: input.workspaceId,
    });

    return;
  }

  /*
   * The booking has already been persisted.
   * Failures in email, calendar, or notification delivery must not prevent
   * the customer from reaching the confirmation page.
   */

  try {
    await sendBookingConfirmation({
      email: booking.customerEmail,
      customerName: booking.customerName,
      businessName:
        booking.workspace.companyName || booking.workspace.name || "Vellum",
      serviceName: booking.service.name,
      bookingDate: booking.date.toLocaleDateString(),
      bookingTime: `${booking.startTime}–${booking.endTime}`,
    });
  } catch (error) {
    console.error("Booking confirmation email failed", {
      bookingId: booking.id,
      error,
    });
  }

  try {
    const bookingStartDateTime = buildBookingDateTime(
      input.date,
      booking.startTime,
    );

    const bookingEndDateTime = buildBookingDateTime(
      input.date,
      booking.endTime,
    );

    const calendarEvent = await createBookingCalendarEvent({
      summary: `${booking.service.name} with ${booking.customerName}`,
      description: booking.notes || undefined,
      startDateTime: bookingStartDateTime,
      endDateTime: bookingEndDateTime,
      attendeeEmail: booking.customerEmail,
    });

    if (calendarEvent?.id) {
      await prismaBookingWorkflowRepository.updateGoogleCalendarEventId({
        bookingId: booking.id,
        googleCalendarEventId: calendarEvent.id,
      });
    }
  } catch (error) {
    console.error("Booking calendar synchronization failed", {
      bookingId: booking.id,
      error,
    });
  }

  try {
    await prismaBookingWorkflowRepository.createWorkspaceAdminNotification({
      workspaceId: input.workspaceId,
      title: "New booking created",
      message: `${booking.customerName} booked ${booking.service.name} for ${booking.date.toLocaleDateString()} at ${booking.startTime}.`,
      href: `/bookings/${booking.id}`,
    });
  } catch (error) {
    console.error("Booking notification creation failed", {
      bookingId: booking.id,
      error,
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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await updateBookingStatusService.execute({
    bookingId: input.bookingId,
    workspaceId,
    status: input.status,
  });

  if (!result.success) {
    return;
  }

  if (result.status === "CANCELLED" && result.previousGoogleCalendarEventId) {
    await deleteBookingCalendarEvent(result.previousGoogleCalendarEventId);
  }

  if (result.status === "CANCELLED") {
    await prismaBookingWorkflowRepository.createUserNotification({
      userId: session.user.id,
      title: "Booking cancelled",
      message: "A booking was cancelled and removed from the active calendar.",
      href: `/bookings/${result.bookingId}`,
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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await rescheduleBookingService.execute({
    bookingId: input.bookingId,
    workspaceId,
    date: input.date,
    startTime: input.startTime,
  });

  if (!result.success || !result.bookingId) {
    console.warn("Booking reschedule failed", {
      bookingId: input.bookingId,
      workspaceId,
      code: result.code,
      reasons: result.reasons,
    });

    return;
  }

  const updatedBooking =
    await prismaBookingWorkflowRepository.findBookingForWorkflow({
      bookingId: result.bookingId,
      workspaceId,
    });

  if (!updatedBooking) {
    console.error("Rescheduled booking could not be reloaded", {
      bookingId: result.bookingId,
      workspaceId,
    });

    return;
  }

  const startDateTime = buildBookingDateTime(
    input.date,
    updatedBooking.startTime,
  );

  const endDateTime = buildBookingDateTime(input.date, updatedBooking.endTime);

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

  await prismaBookingWorkflowRepository.createUserNotification({
    userId: session.user.id,
    title: "Booking rescheduled",
    message: `${updatedBooking.customerName}'s ${updatedBooking.service.name} booking was moved to ${updatedBooking.date.toLocaleDateString()} at ${updatedBooking.startTime}.`,
    href: `/bookings/${updatedBooking.id}`,
  });

  redirect(`/bookings/${updatedBooking.id}`);
}

export async function createProjectFromBookingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const bookingId = formData.get("bookingId");

  if (typeof bookingId !== "string" || !bookingId.trim()) {
    return;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await createProjectFromBookingService({
    bookingId: bookingId.trim(),
    workspaceId,
    ownerId: session.user.id,
  });

  if (!result.success) {
    console.warn("Project creation from booking failed", {
      bookingId,
      workspaceId,
      reason: result.reason,
    });

    return;
  }

  if (!result.alreadyExisted) {
    await createAuditLog({
      action: "PROJECT_CREATED",
      entity: "PROJECT",
      entityId: result.projectId,
      userId: session.user.id,
      metadata: {
        bookingId: bookingId.trim(),
        source: "BOOKING_COMMAND_CENTER",
      },
    });
  }

  redirect(`/projects/${result.projectId}`);
}
