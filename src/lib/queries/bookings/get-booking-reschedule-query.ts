import { prisma } from "@/lib/prisma";

export async function getBookingRescheduleQuery(
  bookingId: string,
  workspaceId: string,
) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
      workspaceId,
    },
    include: {
      service: true,
    },
  });
}
