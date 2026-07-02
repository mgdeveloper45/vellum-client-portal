export type AutomationTrigger =
  | "BOOKING_CREATED"
  | "BOOKING_COMPLETED"
  | "INVOICE_OVERDUE"
  | "PROJECT_COMPLETED";

export type AutomationAction =
  | "SEND_EMAIL"
  | "CREATE_NOTIFICATION"
  | "GENERATE_AI_DRAFT"
  | "CREATE_ACTIVITY";

export type WorkflowDefinition = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
};
