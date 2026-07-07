import type { AutomationTrigger } from "../automation/automation-types";

export type PlatformEvent = {
  trigger: AutomationTrigger;
  entityId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;
};

export function createPlatformEvent(
  trigger: AutomationTrigger,
  entityId: string,
  payload: Record<string, unknown> = {},
): PlatformEvent {
  return {
    trigger,
    entityId,
    occurredAt: new Date(),
    payload,
  };
}
