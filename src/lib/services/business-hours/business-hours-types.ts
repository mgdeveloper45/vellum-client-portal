import type { BusinessDay } from "../../constants/business-hours";

export interface BusinessHourConfiguration {
  dayOfWeek: BusinessDay;
  openTime: string;
  closeTime: string;
  closed: boolean;
}