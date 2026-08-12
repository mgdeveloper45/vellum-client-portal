import { prisma } from "@/lib/prisma";

import type {
  BookingRepository,
  BookingForProjectCreation,
  CreateBookingRecordInput,
  CreatedBookingRecord,
  LinkBookingToProjectInput,
  RescheduleBookingRecordInput,
  RescheduledBookingRecord,
  UpdateBookingStatusRecordInput,
  UpdatedBookingStatusRecord,
} from "./booking-repository";

export class PrismaBookingRepository implements BookingRepository {
  async create(input: CreateBookingRecordInput): Promise<CreatedBookingRecord> {
    return prisma.booking.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        notes: input.notes,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        serviceId: input.serviceId,
        workspaceId: input.workspaceId,

        depositRequired: input.depositRequired,
        depositAmount: input.depositAmount,
      },
      select: {
        id: true,
      },
    });
  }

  async findForProjectCreation(
    bookingId: string,
    workspaceId: string,
  ): Promise<BookingForProjectCreation | null> {
    return prisma.booking.findFirst({
      where: {
        id: bookingId,
        workspaceId,
      },
      select: {
        id: true,
        workspaceId: true,
        customerName: true,
        customerEmail: true,
        projectId: true,
        service: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async linkToProject(input: LinkBookingToProjectInput): Promise<boolean> {
    const result = await prisma.booking.updateMany({
      where: {
        id: input.bookingId,
        workspaceId: input.workspaceId,
        projectId: null,
      },
      data: {
        projectId: input.projectId,
      },
    });

    return result.count > 0;
  }

  async findForReschedule(bookingId: string, workspaceId: string) {
    return prisma.booking.findFirst({
      where: {
        id: bookingId,
        workspaceId,
      },
      select: {
        id: true,
        workspaceId: true,
        serviceId: true,
        service: {
          select: {
            duration: true,
            price: true,
          },
        },
      },
    });
  }

  async reschedule(
    input: RescheduleBookingRecordInput,
  ): Promise<RescheduledBookingRecord> {
    return prisma.booking.update({
      where: {
        id: input.bookingId,
      },
      data: {
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        status: "CONFIRMED",
      },
      select: {
        id: true,
      },
    });
  }

  async findForStatusUpdate(bookingId: string, workspaceId: string) {
    return prisma.booking.findFirst({
      where: {
        id: bookingId,
        workspaceId,
      },
      select: {
        id: true,
        googleCalendarEventId: true,
      },
    });
  }

  async updateStatus(
    input: UpdateBookingStatusRecordInput,
  ): Promise<UpdatedBookingStatusRecord> {
    return prisma.booking.update({
      where: {
        id: input.bookingId,
      },
      data: {
        status: input.status,
        googleCalendarEventId: input.googleCalendarEventId,
      },
      select: {
        id: true,
      },
    });
  }
}

export const prismaBookingRepository = new PrismaBookingRepository();
