import type { PlatformEvent } from "../events/event-engine";
import type { AutomationRule } from "./automation-rule";
import type { AutomationTrigger } from "./automation-types";
import type { AutomationExecutionResult } from "./automation-result";

export type AutomationExecutionPlan = {
  event: PlatformEvent;
  matchedRules: AutomationRule[];
  actionCount: number;
};

export function getMatchingAutomationRules(
  trigger: AutomationTrigger,
  rules: AutomationRule[],
): AutomationRule[] {
  return rules.filter((rule) => rule.enabled && rule.trigger === trigger);
}

export function buildAutomationExecutionPlan(
  event: PlatformEvent,
  rules: AutomationRule[],
): AutomationExecutionPlan {
  const matchedRules = getMatchingAutomationRules(event.trigger, rules);


  return {
    event,
    matchedRules,
    actionCount: matchedRules.reduce(
      (total, rule) => total + rule.actions.length,
      0,
    ),
  };
}

export function executeAutomationPlan(
  plan: AutomationExecutionPlan,
): AutomationExecutionResult {
  const executedActions =
    plan.matchedRules.flatMap((rule) =>
      rule.actions.map((action) => ({
        action,
        success: true,
        message: "Simulated execution",
      })),
    );

  return {
    executedActions,
    successfulActions: executedActions.length,
    failedActions: 0,
  };
}