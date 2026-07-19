import type { SchedulingResourceProvider } from "../resources/resource-provider";
import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingPolicy } from "./policy";

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

export class StaffWorkingHoursPolicy implements SchedulingPolicy {
  constructor(private readonly resourceProvider: SchedulingResourceProvider) {}

  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    if (!context.staffId) {
      return;
    }

    const staffAvailability = await this.resourceProvider.getStaffAvailability(
      context.workspaceId,
      context.staffId,
      context.bookingDate,
    );

    if (!staffAvailability) {
      reject(decision, "The selected staff member is unavailable.");

      return;
    }

    if (!staffAvailability.enabled) {
      reject(decision, "The selected staff member is not accepting bookings.");

      return;
    }

    if (!staffAvailability.workingHours) {
      reject(decision, "The selected staff member is not working on this day.");

      return;
    }

    const openingMinutes = convertTimeToMinutes(
      staffAvailability.workingHours.open,
    );

    const closingMinutes = convertTimeToMinutes(
      staffAvailability.workingHours.close,
    );

    const bookingStartMinutes = convertTimeToMinutes(context.bookingStartTime);

    const bookingEndMinutes = convertTimeToMinutes(context.bookingEndTime);

    if (
      openingMinutes === null ||
      closingMinutes === null ||
      closingMinutes <= openingMinutes
    ) {
      reject(decision, "The selected staff member has invalid working hours.");

      return;
    }

    if (
      bookingStartMinutes === null ||
      bookingEndMinutes === null ||
      bookingEndMinutes <= bookingStartMinutes
    ) {
      reject(decision, "The requested booking time is invalid.");

      return;
    }

    if (bookingStartMinutes < openingMinutes) {
      reject(
        decision,
        `The selected staff member does not begin working until ${staffAvailability.workingHours.open}.`,
      );

      return;
    }

    if (bookingEndMinutes > closingMinutes) {
      reject(
        decision,
        `The selected staff member stops working at ${staffAvailability.workingHours.close}.`,
      );
    }
  }
}
