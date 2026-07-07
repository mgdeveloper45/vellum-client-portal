import type { AutomationTrigger } from "./automation-types";
import type { AutomationRule } from "./automation-rule";

export function getMatchingAutomationRules(
  trigger: AutomationTrigger,
  rules: AutomationRule[],
): AutomationRule[] {
  return rules.filter((rule) => rule.enabled && rule.trigger === trigger);
}
