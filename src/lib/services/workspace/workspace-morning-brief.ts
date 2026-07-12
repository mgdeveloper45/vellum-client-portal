export interface WorkspaceMorningBrief {
  greeting: string;
  dateLabel: string;

  yesterday: {
    revenue: number;
    completedBookings: number;
    newClients: number;
    proposalsAccepted: number;
  };

  today: {
    appointments: number;
    overdueInvoices: number;
    followUps: number;
  };

  estimatedRevenue: number;

  executiveSummary: string;

  recommendations: string[];
}

type BuildWorkspaceMorningBriefInput = {
  firstName?: string | null;

  yesterday: {
    revenue: number;
    completedBookings: number;
    newClients: number;
    proposalsAccepted: number;
  };

  today: {
    appointments: number;
    overdueInvoices: number;
    followUps: number;
  };

  estimatedRevenue: number;
};

export function buildWorkspaceMorningBrief({
  firstName,
  yesterday,
  today,
  estimatedRevenue,
}: BuildWorkspaceMorningBriefInput): WorkspaceMorningBrief {
  const recommendations: string[] = [];

  if (today.overdueInvoices > 0) {
    recommendations.push(
      `Follow up on ${today.overdueInvoices} overdue ${
        today.overdueInvoices === 1 ? "invoice" : "invoices"
      }.`,
    );
  }

  if (today.followUps > 0) {
    recommendations.push(
      `Complete ${today.followUps} client ${
        today.followUps === 1 ? "follow-up" : "follow-ups"
      }.`,
    );
  }

  if (today.appointments > 0) {
    recommendations.push(
      `Review today's ${today.appointments} scheduled ${
        today.appointments === 1 ? "appointment" : "appointments"
      }.`,
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your operations are clear. Focus on delivering excellent client service.",
    );
  }

  const executiveSummary =
    today.overdueInvoices > 0
      ? "Collections require attention today, while bookings and client activity remain on track."
      : today.appointments > 0
        ? "Your schedule is active and collections are currently healthy."
        : "Your business is operating normally with no urgent issues detected.";

  return {
    greeting: `Good morning${firstName ? `, ${firstName}` : ""}.`,

    dateLabel: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date()),

    yesterday,

    today,

    estimatedRevenue,

    executiveSummary,

    recommendations,
  };
}
