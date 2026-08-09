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
    normalized.includes("project") ||
    normalized.includes("projects") ||
    normalized.includes("milestone") ||
    normalized.includes("milestones") ||
    normalized.includes("job") ||
    normalized.includes("jobs")
  ) {
    return {
      topic: "PROJECTS",
      query,
    };
  }

  if (
    normalized.includes("overview") ||
    normalized.includes("business") ||
    normalized.includes("dashboard") ||
    normalized.includes("everything") ||
    normalized.includes("summary")
  ) {
    return {
      topic: "GENERAL",
      query,
    };
  }

  if (
    normalized.includes("revenue") ||
    normalized.includes("income") ||
    normalized.includes("sales") ||
    normalized.includes("cash flow") ||
    normalized.includes("cashflow") ||
    normalized.includes("profit")
  ) {
    return {
      topic: "REVENUE",
      query,
    };
  }

  if (
    normalized.includes("booking") ||
    normalized.includes("bookings") ||
    normalized.includes("appointment") ||
    normalized.includes("appointments") ||
    normalized.includes("schedule")
  ) {
    return {
      topic: "BOOKINGS",
      query,
    };
  }

  if (
    normalized.includes("capacity") ||
    normalized.includes("availability") ||
    normalized.includes("available") ||
    normalized.includes("utilization")
  ) {
    return {
      topic: "CAPACITY",
      query,
    };
  }

  if (
    normalized.includes("client") ||
    normalized.includes("clients") ||
    normalized.includes("customer") ||
    normalized.includes("customers")
  ) {
    return {
      topic: "CLIENTS",
      query,
    };
  }

  if (
    normalized.includes("invoice") ||
    normalized.includes("invoices") ||
    normalized.includes("payment") ||
    normalized.includes("payments") ||
    normalized.includes("outstanding") ||
    normalized.includes("collect") ||
    normalized.includes("collection") ||
    normalized.includes("collections") ||
    normalized.includes("unpaid")
  ) {
    return {
      topic: "INVOICES",
      query,
    };
  }

  if (
    normalized.includes("risk") ||
    normalized.includes("problem") ||
    normalized.includes("issue") ||
    normalized.includes("danger") ||
    normalized.includes("priority") ||
    normalized.includes("focus") ||
    normalized.includes("attention")
  ) {
    return {
      topic: "RISKS",
      query,
    };
  }

  if (
    normalized.includes("recommend") ||
    normalized.includes("recommendation") ||
    normalized.includes("advice") ||
    normalized.includes("next") ||
    normalized.includes("priority") ||
    normalized.includes("focus") ||
    normalized.includes("should i") ||
    normalized.includes("what should")
  ) {
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
