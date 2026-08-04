import type { WorkflowAction } from "./workflow-action";
import type { WorkflowEvent } from "./workflow-event";

export interface WorkflowRule {
  event: WorkflowEvent;

  actions: WorkflowAction[];
}
