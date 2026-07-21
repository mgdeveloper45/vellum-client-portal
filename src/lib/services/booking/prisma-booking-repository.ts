import { prisma } from "@/lib/prisma";
import type {
  BookingRepository,
  CreateBookingRecordInput,
  CreatedBookingRecord, 
} from "./booking-repository";

export class PrismaBookingRepository implements BookingRepository {
  async findActiveService(serviceId: string, workspaceId: string) {
    return prisma.service.findFirst({
      where: {
        id: serviceId,
        workspaceId,
        active: true,
      },
      select: {
        id: true,
        workspaceId: true,
        name: true,
        duration: true,
        price: true,
      },
    });
  }

  async create(
    input: CreateBookingRecordInput,
  ): Promise<CreatedBookingRecord> {
    return prisma.booking.create({
      data: input,
      select: {
        id: true,
      },
    });
  }
}

export const prismaBookingRepository = new PrismaBookingRepository();
