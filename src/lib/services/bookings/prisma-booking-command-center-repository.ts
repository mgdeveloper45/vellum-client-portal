import { prisma } from "@/lib/prisma";
import type {
  BookingCommandCenterBooking,
  BookingCommandCenterProject,
  BookingCommandCenterRepository,
} from "./booking-command-center-repository";

export class PrismaBookingCommandCenterRepository implements BookingCommandCenterRepository {
  async findBooking(input: {
    bookingId: string;
    workspaceId: string;
  }): Promise<BookingCommandCenterBooking | null> {
    return prisma.booking.findFirst({
      where: {
        id: input.bookingId,
        workspaceId: input.workspaceId,
      },
      include: {
        service: true,
        workspace: true,
      },
    });
  }

  async findRelatedProjects(input: {
    workspaceId: string;
    customerEmail: string;
  }): Promise<BookingCommandCenterProject[]> {
    return prisma.project.findMany({
      where: {
        workspaceId: input.workspaceId,
        client: {
          email: input.customerEmail,
        },
      },
      include: {
        invoices: true,
        messages: true,
        files: true,
      },
    });
  }
}

export const prismaBookingCommandCenterRepository =
  new PrismaBookingCommandCenterRepository();
