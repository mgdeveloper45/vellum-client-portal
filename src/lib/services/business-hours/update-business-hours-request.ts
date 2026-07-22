import type { BusinessHourConfiguration } from "./business-hours-types";

export interface UpdateBusinessHoursRequest {
  workspaceId: string;
  businessHours: readonly BusinessHourConfiguration[];
}
