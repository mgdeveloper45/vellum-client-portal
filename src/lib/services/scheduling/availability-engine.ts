import { prisma } from "@/lib/prisma";

export interface AvailabilityRequest {
  workspaceId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  excludeBookingId?: string;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
}

function timeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function normalizeBookingDate(date: Date): Date {
  const normalizedDate = new Date(date);

  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
}

export async function checkAvailability(
  request: AvailabilityRequest,
): Promise<AvailabilityResult> {
  const startMinutes = timeToMinutes(request.startTime);
  const endMinutes = timeToMinutes(request.endTime);

  if (startMinutes === null || endMinutes === null) {
    return {
      available: false,
      reason: "The requested booking time is invalid.",
    };
  }

  if (endMinutes <= startMinutes) {
    return {
      available: false,
      reason: "The booking end time must be after the start time.",
    };
  }

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      workspaceId: request.workspaceId,
      date: normalizeBookingDate(request.bookingDate),
      status: {
        not: "CANCELLED",
      },
      ...(request.excludeBookingId
        ? {
            id: {
              not: request.excludeBookingId,
            },
          }
        : {}),
      startTime: {
        lt: request.endTime,
      },
      endTime: {
        gt: request.startTime,
      },
    },
    select: {
      id: true,
    },
  });

  if (conflictingBooking) {
    return {
      available: false,
      reason: "The requested time overlaps an existing booking.",
    };
  }

  return {
    available: true,
  };
}
