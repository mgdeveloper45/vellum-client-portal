import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/lib/generated/prisma/client";

type ListBookingsQueryParams = {
  workspaceId: string;
  monthStart: Date;
  monthEnd: Date;
  status: string;
};

export async function listBookingsQuery({
  workspaceId,
  monthStart,
  monthEnd,
  status,
}: ListBookingsQueryParams) {
  const bookingStatusFilter =
    status === "ALL"
      ? {
          not: BookingStatus.CANCELLED,
        }
      : Object.values(BookingStatus).includes(status as BookingStatus)
        ? (status as BookingStatus)
        : {
            not: BookingStatus.CANCELLED,
          };

  return prisma.booking.findMany({
    where: {
      workspaceId,
      status: bookingStatusFilter,
      date: {
        gte: monthStart,
        lt: monthEnd,
      },
    },
    include: {
      service: true,
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });
}
