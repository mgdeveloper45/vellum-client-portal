import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingPolicy } from "./policy";

export class AdvanceNoticePolicy implements SchedulingPolicy {
  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    const minimumMinutes = context.configuration.minimumAdvanceNoticeMinutes;

    if (minimumMinutes === 0) {
      return;
    }

    const earliestBooking = new Date();

    earliestBooking.setMinutes(earliestBooking.getMinutes() + minimumMinutes);

    if (context.bookingDate < earliestBooking) {
      decision.allowed = false;

      decision.reasons.push(
        `Bookings require at least ${minimumMinutes} minutes notice.`,
      );
    }
  }
}
