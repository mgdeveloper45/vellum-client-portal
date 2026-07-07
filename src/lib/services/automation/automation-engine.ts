import type { PlatformEvent } from "../events/event-engine";
import type { AutomationRule } from "./automation-rule";
import type { AutomationTrigger } from "./automation-types";

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
