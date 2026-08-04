import type { WorkflowAction } from "./workflow-action";
import type { WorkflowEvent } from "./workflow-event";

export interface WorkflowContext {
  event: WorkflowEvent;

  payload: Record<string, unknown>;
}

export interface WorkflowActionHandler {
  action: WorkflowAction;

  execute(context: WorkflowContext): Promise<void>;
}
