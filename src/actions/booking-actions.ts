"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { canManageWorkspace } from "@/lib/permissions";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { createGoogleCalendarEvent } from "@/lib/google-calendar";
import {
  minutesToTime,
  timeToMinutes,
} from "@/lib/services/booking/availability-service";

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

  await sendBookingConfirmationEmail({
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

  const calendarEvent = await createGoogleCalendarEvent({
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

  await prisma.booking.update({
    where: {
      id: bookingId,
      workspaceId: currentUser.workspaceId,
    },
    data: {
      status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
    },
  });

  redirect("/bookings");
}
