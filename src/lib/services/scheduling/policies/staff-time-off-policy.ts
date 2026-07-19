import type { StaffTimeOffRepository } from "@/lib/repositories/staff-time-off-repository";

import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingPolicy } from "./policy";

export class StaffTimeOffPolicy implements SchedulingPolicy {
  constructor(private readonly repository: StaffTimeOffRepository) {}

  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    if (!context.staffId) {
      return;
    }

    const timeOff = await this.repository.findActiveTimeOff({
      workspaceId: context.workspaceId,
      staffId: context.staffId,
      bookingDate: context.bookingDate,
    });

    if (!timeOff) {
      return;
    }

    decision.allowed = false;
    decision.reasons.push("The selected staff member is unavailable.");
  }
}
