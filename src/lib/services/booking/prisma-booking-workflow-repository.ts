import { prisma } from "@/lib/prisma";
import type {
  BookingWorkflowRepository,
  BookingWorkflowRecord,
  CreateBookingNotificationInput,
} from "./booking-workflow-repository";

export class PrismaBookingWorkflowRepository implements BookingWorkflowRepository {
  async findBookingForWorkflow(input: {
    bookingId: string;
    workspaceId: string;
  }): Promise<BookingWorkflowRecord | null> {
    return prisma.booking.findFirst({
      where: {
        id: input.bookingId,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        notes: true,
        date: true,
        startTime: true,
        endTime: true,
        googleCalendarEventId: true,
        service: {
          select: {
            name: true,
          },
        },
        workspace: {
          select: {
            name: true,
            companyName: true,
          },
        },
      },
    });
  }

  async updateGoogleCalendarEventId(input: {
    bookingId: string;
    googleCalendarEventId: string;
  }): Promise<void> {
    await prisma.booking.update({
      where: {
        id: input.bookingId,
      },
      data: {
        googleCalendarEventId: input.googleCalendarEventId,
      },
    });
  }

  async createWorkspaceAdminNotification(input: {
    workspaceId: string;
    title: string;
    message: string;
    href: string;
  }): Promise<boolean> {
    const workspaceAdmin = await prisma.user.findFirst({
      where: {
        workspaceId: input.workspaceId,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
      select: {
        id: true,
      },
    });

    if (!workspaceAdmin) {
      return false;
    }

    await prisma.notification.create({
      data: {
        userId: workspaceAdmin.id,
        title: input.title,
        message: input.message,
        type: "BOOKING",
        href: input.href,
      },
    });

    return true;
  }

  async createUserNotification(
    input: CreateBookingNotificationInput,
  ): Promise<void> {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: "BOOKING",
        href: input.href,
      },
    });
  }
}

export const prismaBookingWorkflowRepository =
  new PrismaBookingWorkflowRepository();
