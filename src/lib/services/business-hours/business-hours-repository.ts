import type { BusinessHourConfiguration } from "./business-hours-types";

export interface UpsertWeeklyBusinessHoursInput {
  workspaceId: string;
  businessHours: readonly BusinessHourConfiguration[];
}

export interface BusinessHoursRepository {
  upsertWeeklySchedule(input: UpsertWeeklyBusinessHoursInput): Promise<void>;
}
