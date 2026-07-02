export type AICommand =
  | "workspace-summary"
  | "unpaid-invoices"
  | "todays-bookings"
  | "recent-messages"
  | "stale-projects"
  | "unknown";

export function routeCommand(input: string): AICommand {
  const command = input.toLowerCase();

  if (
    command.includes("summary") ||
    command.includes("overview") ||
    command.includes("status")
  ) {
    return "workspace-summary";
  }

  if (command.includes("invoice") || command.includes("payment")) {
    return "unpaid-invoices";
  }

  if (
    command.includes("today") ||
    command.includes("schedule") ||
    command.includes("booking")
  ) {
    return "todays-bookings";
  }

  if (command.includes("message") || command.includes("reply")) {
    return "recent-messages";
  }

  if (
    command.includes("inactive") ||
    command.includes("stale") ||
    command.includes("project")
  ) {
    return "stale-projects";
  }

  return "unknown";
}
