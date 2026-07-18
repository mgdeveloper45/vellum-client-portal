import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";

export interface SchedulingPolicy {
  evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void>;
}
