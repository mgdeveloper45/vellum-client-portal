import type { WorkflowActionHandler } from "../workflow-action-handler";

export const sendNotificationHandler: WorkflowActionHandler = {
  action: "SEND_NOTIFICATION",

  async execute(context) {
    console.log("Workflow Notification:", context.event, context.payload);

    // Notification service will be connected here.
  },
};
