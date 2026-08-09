export type CopilotIntent =
  "ANSWER" | "PROJECT_SUMMARY" | "PROJECT_STATUS" | "PROPOSAL";

export interface RoutedCopilotIntent {
  intent: CopilotIntent;
  query: string;
}

export function routeCopilotIntent(query: string): RoutedCopilotIntent {
  const normalized = query.toLowerCase().replace(/\s+/g, " ").trim();

  if (
    normalized.includes("executive summary") &&
    (normalized.includes("project") || normalized.includes("milestone"))
  ) {
    return {
      intent: "PROJECT_SUMMARY",
      query,
    };
  }

  if (
    (normalized.includes("project status") ||
      normalized.includes("status of") ||
      normalized.includes("project health")) &&
    (normalized.includes("project") || normalized.includes("status"))
  ) {
    return {
      intent: "PROJECT_STATUS",
      query,
    };
  }

  if (
    normalized.includes("create proposal") ||
    normalized.includes("generate proposal") ||
    normalized.includes("draft proposal")
  ) {
    return {
      intent: "PROPOSAL",
      query,
    };
  }

  return {
    intent: "ANSWER",
    query,
  };
}
