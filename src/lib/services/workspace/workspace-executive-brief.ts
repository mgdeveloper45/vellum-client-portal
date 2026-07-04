export type WorkspaceExecutiveBrief = {
  headline: string;
  summary: string;
  confidence: number;
};

type WorkspaceExecutiveBriefInput = {
  todaysBookings: number;
  overdueInvoices: number;
  outstandingRevenue: number;
  workspaceHealth: number;
};

export function generateWorkspaceExecutiveBrief({
  todaysBookings,
  overdueInvoices,
  outstandingRevenue,
  workspaceHealth,
}: WorkspaceExecutiveBriefInput): WorkspaceExecutiveBrief {
  if (overdueInvoices > 0) {
    return {
      headline: "Cash collection should be today's priority.",
      summary: `You have ${overdueInvoices} unpaid invoice${
        overdueInvoices === 1 ? "" : "s"
      } totaling approximately $${outstandingRevenue.toLocaleString()}. Collecting payment before the end of the day will improve cash flow while keeping today's schedule on track.`,
      confidence: 98,
    };
  }

  if (todaysBookings > 0) {
    return {
      headline: "Focus on delivering an excellent client experience.",
      summary: `You have ${todaysBookings} booking${
        todaysBookings === 1 ? "" : "s"
      } scheduled today. Staying ahead of your schedule will keep your workspace operating smoothly.`,
      confidence: 96,
    };
  }

  return {
    headline: "Operations are running smoothly.",
    summary:
      workspaceHealth >= 90
        ? "Everything looks healthy today. This is a great opportunity to focus on growth, follow-ups, and client relationships."
        : "No urgent issues were detected. Continue monitoring your workspace throughout the day.",
    confidence: 95,
  };
}