import { workflowHandlers } from "./workflow-handler-registry";
import { defaultWorkflowRules } from "./default-workflow-rules";

import type { WorkflowContext } from "./workflow-action-handler";

export async function executeWorkflow(context: WorkflowContext): Promise<void> {
  const rule = defaultWorkflowRules.find(
    (rule) => rule.event === context.event,
  );

  if (!rule) {
    return;
  }

  for (const action of rule.actions) {
    const handler = workflowHandlers.find(
      (handler) => handler.action === action,
    );

    if (!handler) {
      continue;
    }

    await handler.execute(context);
  }
}
