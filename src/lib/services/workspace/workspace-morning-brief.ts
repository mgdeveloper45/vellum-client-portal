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

export function buildWorkspaceMorningBrief(): WorkspaceMorningBrief {
  return {
    greeting: "Good morning",

    dateLabel: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date()),

    yesterday: {
      revenue: 0,
      completedBookings: 0,
      newClients: 0,
      proposalsAccepted: 0,
    },

    today: {
      appointments: 0,
      overdueInvoices: 0,
      followUps: 0,
    },

    estimatedRevenue: 0,

    executiveSummary:
      "Your business is operating normally today.",

    recommendations: [],
  };
}