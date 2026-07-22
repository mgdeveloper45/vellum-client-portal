import type { BusinessDay } from "../../constants/business-hours";
import type { BusinessHourConfiguration } from "./business-hours-types";

export interface UpsertWeeklyBusinessHoursInput {
  workspaceId: string;
  businessHours: readonly BusinessHourConfiguration[];
}

export interface FindBusinessHoursForDayInput {
  workspaceId: string;
  dayOfWeek: BusinessDay;
}

export interface BusinessHoursRecord {
  dayOfWeek: BusinessDay;
  openTime: string;
  closeTime: string;
  closed: boolean;
}

export interface BusinessHoursRepository {
  findForDay(
    input: FindBusinessHoursForDayInput,
  ): Promise<BusinessHoursRecord | null>;

  upsertWeeklySchedule(input: UpsertWeeklyBusinessHoursInput): Promise<void>;
}
