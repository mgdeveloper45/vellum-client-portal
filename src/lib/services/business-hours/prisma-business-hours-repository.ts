import { prisma } from "../../prisma";

import type {
  BusinessHoursRecord,
  BusinessHoursRepository,
  FindBusinessHoursForDayInput,
  UpsertWeeklyBusinessHoursInput,
} from "./business-hours-repository";

export const prismaBusinessHoursRepository: BusinessHoursRepository = {
  async findForDay({
    workspaceId,
    dayOfWeek,
  }: FindBusinessHoursForDayInput): Promise<BusinessHoursRecord | null> {
    return prisma.businessHour.findUnique({
      where: {
        workspaceId_dayOfWeek: {
          workspaceId,
          dayOfWeek,
        },
      },
      select: {
        dayOfWeek: true,
        openTime: true,
        closeTime: true,
        closed: true,
      },
    });
  },

  async upsertWeeklySchedule({
    workspaceId,
    businessHours,
  }: UpsertWeeklyBusinessHoursInput): Promise<void> {
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
