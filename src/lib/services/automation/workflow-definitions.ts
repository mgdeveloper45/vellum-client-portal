import { WorkflowDefinition } from "@/types/automation";

export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: "invoice-reminder",
    name: "Invoice Reminder",
    description:
      "Generate an AI reminder and notify the workspace owner when an invoice becomes overdue.",
    enabled: true,
    trigger: "INVOICE_OVERDUE",
    actions: ["GENERATE_AI_DRAFT", "CREATE_NOTIFICATION"],
  },
  {
    id: "booking-confirmation",
    name: "Booking Confirmation",
    description:
      "Send confirmation emails and create activity records after a booking is created.",
    enabled: true,
    trigger: "BOOKING_CREATED",
    actions: ["SEND_EMAIL", "CREATE_ACTIVITY"],
  },
  {
    id: "project-completed",
    name: "Project Completion",
    description:
      "Notify the client and create an activity entry when a project is completed.",
    enabled: true,
    trigger: "PROJECT_COMPLETED",
    actions: ["SEND_EMAIL", "CREATE_ACTIVITY", "CREATE_NOTIFICATION"],
  },
];
