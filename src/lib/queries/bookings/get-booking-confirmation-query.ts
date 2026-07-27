import { prisma } from "@/lib/prisma";

export async function getBookingConfirmationQuery(bookingId: string) {
  return prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
      workspace: true,
    },
  });
}
