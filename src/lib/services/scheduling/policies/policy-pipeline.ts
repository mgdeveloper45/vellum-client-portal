import type { SchedulingDecision } from "../scheduling-decision";
import type { SchedulingContext } from "../scheduling-context";
import type { SchedulingPolicy } from "./policy";

export class PolicyPipeline {
  constructor(private readonly policies: SchedulingPolicy[]) {}

  async evaluate(
    context: SchedulingContext,
    decision: SchedulingDecision,
  ): Promise<void> {
    for (const policy of this.policies) {
      if (!decision.allowed) {
        return;
      }

      await policy.evaluate(context, decision);
    }
  }
}
