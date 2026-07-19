import { prisma } from "@/lib/prisma";

import type {
  BlackoutDateRecord,
  BlackoutDateRepository,
  FindBlackoutDateRequest,
} from "./blackout-date-repository";

export class PrismaBlackoutDateRepository implements BlackoutDateRepository {
  async findActiveBlackoutForDate(
    request: FindBlackoutDateRequest,
  ): Promise<BlackoutDateRecord | null> {
    const blackoutDate = await prisma.blackoutDate.findFirst({
      where: {
        workspaceId: request.workspaceId,
        enabled: true,
        startDate: {
          lte: request.bookingDate,
        },
        endDate: {
          gte: request.bookingDate,
        },
      },
      orderBy: [
        {
          startDate: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      select: {
        id: true,
        workspaceId: true,
        name: true,
        startDate: true,
        endDate: true,
        enabled: true,
      },
    });

    return blackoutDate;
  }
}
