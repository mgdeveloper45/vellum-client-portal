"use server";

import { prisma } from "@/lib/prisma";
import {
  minutesToTime,
  timeToMinutes,
} from "@/lib/services/booking/availability-service";
import { redirect } from "next/navigation";

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
  });

  redirect(`/booking-confirmation/${booking.id}`);
}
