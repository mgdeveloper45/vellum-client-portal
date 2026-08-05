export type CopilotTopic =
  | "GENERAL"
  | "REVENUE"
  | "BOOKINGS"
  | "CAPACITY"
  | "CLIENTS"
  | "PROJECTS"
  | "INVOICES"
  | "RISKS"
  | "RECOMMENDATIONS";

export interface CopilotQuestion {
  topic: CopilotTopic;
  query: string;
}

export function routeCopilotQuestion(query: string): CopilotQuestion {
  const normalized = query.toLowerCase();

  if (
    normalized.includes("revenue") ||
    normalized.includes("income") ||
    normalized.includes("sales")
  ) {
    return {
      topic: "REVENUE",
      query,
    };
  }

  if (
    normalized.includes("booking") ||
    normalized.includes("appointment") ||
    normalized.includes("schedule")
  ) {
    return {
      topic: "BOOKINGS",
      query,
    };
  }

  if (normalized.includes("capacity") || normalized.includes("availability")) {
    return {
      topic: "CAPACITY",
      query,
    };
  }

  if (normalized.includes("invoice") || normalized.includes("payment")) {
    return {
      topic: "INVOICES",
      query,
    };
  }

  if (normalized.includes("risk")) {
    return {
      topic: "RISKS",
      query,
    };
  }

  if (normalized.includes("recommend")) {
    return {
      topic: "RECOMMENDATIONS",
      query,
    };
  }

  return {
    topic: "GENERAL",
    query,
  };
}
