import type { BlackoutDateRepository } from "@/lib/repositories/blackout-date-repository";

import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingPolicy } from "./policy";

export class BlackoutDatePolicy implements SchedulingPolicy {
  constructor(private readonly repository: BlackoutDateRepository) {}

  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    const blackoutDate = await this.repository.findActiveBlackoutForDate({
      workspaceId: context.workspaceId,
      bookingDate: context.bookingDate,
    });

    if (!blackoutDate) {
      return;
    }

    decision.allowed = false;

    decision.reasons.push(
      `Bookings are unavailable during the "${blackoutDate.name}" blackout period.`,
    );
  }
}
