import type { AiAction } from "./action";

export function routeAiAction(question: string): AiAction {
  const normalized = question.toLowerCase();

  if (normalized.includes("email") || normalized.includes("reminder")) {
    return {
      type: "DRAFT_EMAIL",
      confidence: 95,
      explanation: "User wants to draft an email.",
    };
  }

  if (normalized.includes("task") || normalized.includes("follow up")) {
    return {
      type: "CREATE_TASK",
      confidence: 95,
      explanation: "User wants a follow-up task.",
    };
  }

  if (normalized.includes("booking") || normalized.includes("appointment")) {
    return {
      type: "CREATE_BOOKING",
      confidence: 90,
      explanation: "User wants a booking.",
    };
  }

  if (normalized.includes("invoice")) {
    return {
      type: "CREATE_INVOICE",
      confidence: 90,
      explanation: "User wants to work with invoices.",
    };
  }

  return {
    type: "NONE",
    confidence: 100,
    explanation: "No executable action detected.",
  };
}
