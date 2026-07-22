import { prisma } from "@/lib/prisma";
import type {
  BusinessHoursRepository,
  UpsertWeeklyBusinessHoursInput,
} from "./business-hours-repository";

export const prismaBusinessHoursRepository: BusinessHoursRepository = {
  async upsertWeeklySchedule({
    workspaceId,
    businessHours,
  }: UpsertWeeklyBusinessHoursInput) {
    await Promise.all(
      businessHours.map((hours) =>
        prisma.businessHour.upsert({
          where: {
            workspaceId_dayOfWeek: {
              workspaceId,
              dayOfWeek: hours.dayOfWeek,
            },
          },
          update: {
            closed: hours.closed,
            openTime: hours.openTime,
            closeTime: hours.closeTime,
          },
          create: {
            workspaceId,
            dayOfWeek: hours.dayOfWeek,
            closed: hours.closed,
            openTime: hours.openTime,
            closeTime: hours.closeTime,
          },
        }),
      ),
    );
  },
};
