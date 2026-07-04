export type WorkspaceMission = {
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

type WorkspaceMissionInput = {
  overdueInvoices: number;
  todaysBookings: number;
  bookingsNeedingAttention: number;
};

export function determineWorkspaceMission({
  overdueInvoices,
  todaysBookings,
  bookingsNeedingAttention,
}: WorkspaceMissionInput): WorkspaceMission {
  if (overdueInvoices > 0) {
    return {
      title: "Collect outstanding payments",
      description: `You have ${overdueInvoices} overdue invoice${
        overdueInvoices === 1 ? "" : "s"
      } that should be followed up today.`,
      priority: "HIGH",
    };
  }

  if (bookingsNeedingAttention > 0) {
    return {
      title: "Prepare upcoming bookings",
      description: `${bookingsNeedingAttention} booking${
        bookingsNeedingAttention === 1 ? "" : "s"
      } require attention before clients arrive.`,
      priority: "HIGH",
    };
  }

  if (todaysBookings > 0) {
    return {
      title: "Focus on today's schedule",
      description: `You have ${todaysBookings} booking${
        todaysBookings === 1 ? "" : "s"
      } scheduled today.`,
      priority: "MEDIUM",
    };
  }

  return {
    title: "Everything is under control",
    description: "There are no urgent operational tasks at the moment.",
    priority: "LOW",
  };
}
