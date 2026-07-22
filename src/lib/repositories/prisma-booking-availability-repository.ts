import { prisma } from "../prisma";

import type {
  BookingAvailabilityRecord,
  BookingAvailabilityRepository,
  FindBookingAvailabilityInput,
} from "./booking-availability-repository";

function normalizeBookingDate(date: Date): Date {
  const normalizedDate = new Date(date);

  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
}

export class PrismaBookingAvailabilityRepository implements BookingAvailabilityRepository {
  async findActiveBookingsForDate(
    input: FindBookingAvailabilityInput,
  ): Promise<BookingAvailabilityRecord[]> {
    return prisma.booking.findMany({
      where: {
        workspaceId: input.workspaceId,
        date: normalizeBookingDate(input.bookingDate),
        status: {
          not: "CANCELLED",
        },
        ...(input.serviceId
          ? {
              serviceId: input.serviceId,
            }
          : {}),
        ...(input.excludeBookingId
          ? {
              id: {
                not: input.excludeBookingId,
              },
            }
          : {}),
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }
}

export const prismaBookingAvailabilityRepository =
  new PrismaBookingAvailabilityRepository();
