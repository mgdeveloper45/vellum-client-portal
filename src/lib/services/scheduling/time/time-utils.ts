export function convertTimeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

export function isValidTime(time: string): boolean {
  return convertTimeToMinutes(time) !== null;
}

export function isWithinTimeRange(
  value: number,
  start: number,
  end: number,
): boolean {
  return value >= start && value <= end;
}

export function compareTimes(left: string, right: string): number | null {
  const leftMinutes = convertTimeToMinutes(left);
  const rightMinutes = convertTimeToMinutes(right);

  if (leftMinutes === null || rightMinutes === null) {
    return null;
  }

  return leftMinutes - rightMinutes;
}

export function minutesBetween(start: string, end: string): number | null {
  const startMinutes = convertTimeToMinutes(start);
  const endMinutes = convertTimeToMinutes(end);

  if (startMinutes === null || endMinutes === null) {
    return null;
  }

  return endMinutes - startMinutes;
}

export function addMinutes(time: string, minutes: number): string | null {
  const value = convertTimeToMinutes(time);

  if (value === null) {
    return null;
  }

  const total = value + minutes;

  if (total < 0 || total >= 24 * 60) {
    return null;
  }

  const hours = Math.floor(total / 60);
  const remainingMinutes = total % 60;

  return `${hours.toString().padStart(2, "0")}:${remainingMinutes
    .toString()
    .padStart(2, "0")}`;
}

export function subtractMinutes(
  value: number,
  minutes: number,
): number {
  return value - minutes;
}