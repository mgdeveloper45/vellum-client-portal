import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingPolicy } from "./policy";

export class BookingWindowPolicy implements SchedulingPolicy {
  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    const now = new Date();
    const latestBooking = new Date(now);

    latestBooking.setDate(
      latestBooking.getDate() + context.configuration.maximumBookingWindowDays,
    );

    if (context.bookingDate > latestBooking) {
      decision.allowed = false;

      decision.reasons.push(
        `Bookings may only be scheduled within ${context.configuration.maximumBookingWindowDays} days.`,
      );
    }
  }
}
