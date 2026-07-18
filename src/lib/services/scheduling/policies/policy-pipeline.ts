import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingPolicy } from "./policy";

export class PolicyPipeline {
  constructor(private readonly policies: readonly SchedulingPolicy[]) {}

  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    for (const policy of this.policies) {
      await policy.evaluate(context, decision);

      if (!decision.allowed) {
        return;
      }
    }
  }
}
