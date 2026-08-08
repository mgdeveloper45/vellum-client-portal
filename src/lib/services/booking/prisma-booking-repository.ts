import { prisma } from "@/lib/prisma";
import type {
  BookingRepository,
  CreateBookingRecordInput,
  CreatedBookingRecord,
  RescheduleBookingRecordInput,
  RescheduledBookingRecord,
  UpdateBookingStatusRecordInput,
  UpdatedBookingStatusRecord,
} from "./booking-repository";
export class PrismaBookingRepository implements BookingRepository {
  async create(
  input: CreateBookingRecordInput,
): Promise<CreatedBookingRecord> {
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
