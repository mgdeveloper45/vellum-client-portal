export const BUSINESS_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type BusinessDay = (typeof BUSINESS_DAYS)[number];

export const DEFAULT_BUSINESS_HOURS = {
  openTime: "09:00",
  closeTime: "17:00",
};
