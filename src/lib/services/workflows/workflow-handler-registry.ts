import { aiSummaryHandler } from "./handlers/ai-summary-handler";
import { sendNotificationHandler } from "./handlers/send-notification-handler";

import type { WorkflowActionHandler } from "./workflow-action-handler";

export const workflowHandlers: WorkflowActionHandler[] = [
  sendNotificationHandler,
  aiSummaryHandler,
];
