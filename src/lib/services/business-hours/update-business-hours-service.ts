import {
  BUSINESS_DAYS,
  type BusinessDay,
} from "../../constants/business-hours";

import {
  isValidBusinessTime,
  isValidBusinessTimeRange,
} from "../../validation/business-hours";

import type { BusinessHoursRepository } from "./business-hours-repository";
import type { UpdateBusinessHoursRequest } from "./update-business-hours-request";
import type { UpdateBusinessHoursResult } from "./update-business-hours-result";

export interface UpdateBusinessHoursServiceDependencies {
  businessHoursRepository: BusinessHoursRepository;
}

function hasEveryBusinessDay(days: ReadonlySet<BusinessDay>): boolean {
  return BUSINESS_DAYS.every((day) => days.has(day));
}

export function createUpdateBusinessHoursService({
  businessHoursRepository,
}: UpdateBusinessHoursServiceDependencies) {
  return async function updateBusinessHours(
    request: UpdateBusinessHoursRequest,
  ): Promise<UpdateBusinessHoursResult> {
    const workspaceId = request.workspaceId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    if (request.businessHours.length !== BUSINESS_DAYS.length) {
      return {
        success: false,
        reason: "INCOMPLETE_SCHEDULE",
        message: "Business hours must include all seven days.",
      };
    }

    const submittedDays = new Set<BusinessDay>();

    for (const hours of request.businessHours) {
      if (submittedDays.has(hours.dayOfWeek)) {
        return {
          success: false,
          reason: "DUPLICATE_DAY",
          message: `Business hours contain more than one entry for ${hours.dayOfWeek.toLowerCase()}.`,
        };
      }

      submittedDays.add(hours.dayOfWeek);

      if (
        !isValidBusinessTime(hours.openTime) ||
        !isValidBusinessTime(hours.closeTime)
      ) {
        return {
          success: false,
          reason: "INVALID_TIME",
          message: `Business hours for ${hours.dayOfWeek.toLowerCase()} contain an invalid time.`,
        };
      }

      /*
       * Closed days retain their configured times because the
       * existing settings form preserves them for later reuse.
       */
      if (
        !hours.closed &&
        !isValidBusinessTimeRange(hours.openTime, hours.closeTime)
      ) {
        return {
          success: false,
          reason: "INVALID_TIME_RANGE",
          message: `Closing time must be later than opening time for ${hours.dayOfWeek.toLowerCase()}.`,
        };
      }
    }

    if (!hasEveryBusinessDay(submittedDays)) {
      return {
        success: false,
        reason: "INCOMPLETE_SCHEDULE",
        message: "Business hours must include every weekday.",
      };
    }

    await businessHoursRepository.upsertWeeklySchedule({
      workspaceId,
      businessHours: request.businessHours,
    });

    return {
      success: true,
      updatedDays: request.businessHours.length,
    };
  };
}

export type UpdateBusinessHoursService = ReturnType<
  typeof createUpdateBusinessHoursService
>;
