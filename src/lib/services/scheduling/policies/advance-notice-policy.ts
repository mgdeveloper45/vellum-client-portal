import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingPolicy } from "./policy";

export class AdvanceNoticePolicy implements SchedulingPolicy {
  evaluate(context: SchedulingContext, decision: SchedulingDecision): void {
    const now = new Date();

    if (context.bookingDate <= now) {
      decision.allowed = false;

      decision.reasons.push("Bookings must be scheduled in the future.");
    }
  }
}
