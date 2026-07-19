import { prisma } from "@/lib/prisma";

import type {
  FindStaffTimeOffRequest,
  StaffTimeOffRecord,
  StaffTimeOffRepository,
} from "./staff-time-off-repository";

export class PrismaStaffTimeOffRepository implements StaffTimeOffRepository {
  async findActiveTimeOff(
    request: FindStaffTimeOffRequest,
  ): Promise<StaffTimeOffRecord | null> {
    return prisma.staffTimeOff.findFirst({
      where: {
        workspaceId: request.workspaceId,
        staffId: request.staffId,
        enabled: true,
        startDate: {
          lte: request.bookingDate,
        },
        endDate: {
          gte: request.bookingDate,
        },
      },
      select: {
        id: true,
        workspaceId: true,
        staffId: true,
        reason: true,
        startDate: true,
        endDate: true,
        enabled: true,
      },
    });
  }
}
