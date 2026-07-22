import { convertTimeToMinutes } from "../services/scheduling/time/time-utils";

const BUSINESS_TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function isValidBusinessTime(value: string): boolean {
  if (!BUSINESS_TIME_PATTERN.test(value)) {
    return false;
  }

  return convertTimeToMinutes(value) !== null;
}

export function isValidBusinessTimeRange(
  openTime: string,
  closeTime: string,
): boolean {
  const openingMinutes = convertTimeToMinutes(openTime);
  const closingMinutes = convertTimeToMinutes(closeTime);

  return (
    openingMinutes !== null &&
    closingMinutes !== null &&
    closingMinutes > openingMinutes
  );
}
