import type {
  BusinessDayConfiguration,
  BusinessHoursConfiguration,
} from "../scheduling-configuration";
import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingPolicy } from "./policy";

type BusinessDay = keyof BusinessHoursConfiguration;

const BUSINESS_DAYS: readonly BusinessDay[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function convertTimeToMinutes(time: string): number | null {
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

function reject(decision: SchedulingDecision, reason: string): void {
  decision.allowed = false;
  decision.reasons.push(reason);
}

function validateBusinessHours(configuration: BusinessDayConfiguration): {
  openingMinutes: number;
  closingMinutes: number;
} | null {
  const openingMinutes = convertTimeToMinutes(configuration.open);

  const closingMinutes = convertTimeToMinutes(configuration.close);

  if (
    openingMinutes === null ||
    closingMinutes === null ||
    closingMinutes <= openingMinutes
  ) {
    return null;
  }

  return {
    openingMinutes,
    closingMinutes,
  };
}

export class BusinessHoursPolicy implements SchedulingPolicy {
  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    const dayOfWeek = context.bookingDate.getDay();
    const businessDay = BUSINESS_DAYS[dayOfWeek];

    if (!businessDay) {
      reject(decision, "The booking day could not be determined.");

      return;
    }

    const dayConfiguration = context.configuration.businessHours[businessDay];

    if (!dayConfiguration.enabled) {
      reject(decision, `The business is closed on ${businessDay}.`);

      return;
    }

    const configuredHours = validateBusinessHours(dayConfiguration);

    if (!configuredHours) {
      reject(decision, `Business hours for ${businessDay} are invalid.`);

      return;
    }

    const bookingStartMinutes = convertTimeToMinutes(context.bookingStartTime);

    const bookingEndMinutes = convertTimeToMinutes(context.bookingEndTime);

    if (
      bookingStartMinutes === null ||
      bookingEndMinutes === null ||
      bookingEndMinutes <= bookingStartMinutes
    ) {
      reject(decision, "The requested booking time is invalid.");

      return;
    }

    if (bookingStartMinutes < configuredHours.openingMinutes) {
      reject(
        decision,
        `Bookings on ${businessDay} cannot begin before ${dayConfiguration.open}.`,
      );

      return;
    }

    if (bookingEndMinutes > configuredHours.closingMinutes) {
      reject(
        decision,
        `Bookings on ${businessDay} must end by ${dayConfiguration.close}.`,
      );
    }
  }
}
