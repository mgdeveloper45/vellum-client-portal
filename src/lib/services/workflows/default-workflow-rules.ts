import type { WorkflowRule } from "./workflow-rule";

export const defaultWorkflowRules: WorkflowRule[] = [
  {
    event: "DEPOSIT_PAID",

    actions: [
      "SEND_NOTIFICATION",
    ],
  },

  {
    event: "INVOICE_PAID",

    actions: [
      "SEND_NOTIFICATION",
      "AI_SUMMARY",
    ],
  },

  {
    event: "PROJECT_COMPLETED",

    actions: [
      "SEND_NOTIFICATION",
    ],
  },
];