import type { AutomationAction, AutomationTrigger } from "./automation-types";

export type AutomationRule = {
  id: string;

  name: string;

  trigger: AutomationTrigger;

  actions: AutomationAction[];

  enabled: boolean;
};
