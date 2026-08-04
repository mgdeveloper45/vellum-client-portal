import type { WorkflowActionHandler } from "../workflow-action-handler";

export const aiSummaryHandler: WorkflowActionHandler = {
  action: "AI_SUMMARY",

  async execute(context) {
    console.log("AI Summary:", context.event, context.payload);

    // AI service will be connected here.
  },
};
