import type { AutomationRule } from "./automation-rule";
import type { AutomationTrigger } from "./automation-types";

export function getMatchingAutomationRules(
  trigger: AutomationTrigger,
  rules: AutomationRule[],
) {
  return rules.filter(
    (rule) =>
      rule.enabled &&
      rule.trigger === trigger,
  );
}