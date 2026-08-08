import type { AiAction } from "./action";

export function routeAiAction(query: string): AiAction {
  const normalized = query.toLowerCase();

  if (
    normalized.includes("email") ||
    normalized.includes("reminder") ||
    normalized.includes("invoice") ||
    normalized.includes("payment") ||
    normalized.includes("billing")
  ) {
    return {
      type: "DRAFT_EMAIL",
      executor: "EMAIL",
      confidence: 95,
      explanation: "User wants to draft an email.",
    };
  }

  if (normalized.includes("task")) {
    return {
      type: "CREATE_TASK",
      executor: "TASK",
      confidence: 90,
      explanation: "User wants to create a task.",
    };
  }

  if (normalized.includes("booking") || normalized.includes("appointment")) {
    return {
      type: "CREATE_BOOKING",
      executor: "BOOKING",
      confidence: 95,
      explanation: "User wants to create a booking.",
    };
  }

  if (normalized.includes("project") || normalized.includes("update")) {
    return {
      type: "UPDATE_PROJECT",
      executor: "PROJECT",
      confidence: 90,
      explanation: "User wants to update a project.",
    };
  }

  return {
    type: "NONE",
    executor: null,
    confidence: 100,
    explanation: "No executable action detected.",
  };
}
