import { prisma } from "@/lib/prisma";
import type {
  BookingCommandCenterBooking,
  BookingCommandCenterRepository,
} from "./booking-command-center-repository";

export class PrismaBookingCommandCenterRepository implements BookingCommandCenterRepository {
  async findBooking(input: {
    bookingId: string;
    workspaceId: string;
  }): Promise<BookingCommandCenterBooking | null> {
    const booking = await prisma.booking.findFirst({
      where: {
        id: input.bookingId,
        workspaceId: input.workspaceId,
      },
      include: {
        service: true,
        workspace: true,
        project: {
          include: {
            invoices: true,
            messages: true,
            files: true,
            deposits: {
              include: {
                payments: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return null;
    }

    return {
      ...booking,
      depositAmount: Number(booking.depositAmount),
      project: booking.project
        ? {
            id: booking.project.id,
            invoices: booking.project.invoices.map((invoice) => ({
              id: invoice.id,
              paid: invoice.paid,
            })),
            messages: booking.project.messages,
            files: booking.project.files,
            deposits: booking.project.deposits.map((deposit) => ({
              amount: Number(deposit.amount),
              status: deposit.status,
              payments: deposit.payments.map((payment) => ({
                amount: Number(payment.amount),
              })),
            })),
          }
        : null,
    };
  }
}

export const prismaBookingCommandCenterRepository =
  new PrismaBookingCommandCenterRepository();
