import type {
  BuildDashboardOrchestratorInput,
  DashboardMetrics,
} from "@/lib/services/dashboard/dashboard-orchestrator-types";

type DashboardPresentationInput = Pick<
  BuildDashboardOrchestratorInput,
  | "todaysBookings"
  | "activeProjects"
  | "pendingMilestones"
  | "openInvoices"
  | "totalClients"
  | "revenueCollected"
  | "revenueOutstanding"
  | "bookingTrendCounts"
  | "nextSevenDayLabels"
> & {
  metrics: DashboardMetrics;
};

export function buildDashboardPresentation({
  todaysBookings,
  activeProjects,
  pendingMilestones,
  openInvoices,
  totalClients,
  revenueCollected,
  revenueOutstanding,
  bookingTrendCounts,
  nextSevenDayLabels,
  metrics,
}: DashboardPresentationInput) {
  const heroMetrics = [
    {
      label: "Bookings Today",
      value: todaysBookings,
      helper: "Scheduled appointments",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      helper: "Currently in progress",
    },
    {
      label: "Pending Milestones",
      value: pendingMilestones,
      helper: "Need attention",
    },
    {
      label: "Open Invoices",
      value: openInvoices,
      helper: "Awaiting payment",
    },
    {
      label: "Clients",
      value: totalClients,
      helper: "Total client accounts",
    },
  ];

  const professionalMetrics = [
    {
      label: "Revenue Collected",
      value: revenueCollected.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      helper: "Paid invoices",
    },
    {
      label: "Outstanding Revenue",
      value: revenueOutstanding.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      helper: "Awaiting payment",
    },
    {
      label: "Collection Rate",
      value: `${metrics.collectionRate}%`,
      helper: "Invoices paid",
    },
    {
      label: "Proposal Conversion",
      value: `${metrics.proposalConversionRate}%`,
      helper: "Proposals approved",
    },
    {
      label: "Project Completion",
      value: `${metrics.projectCompletionRate}%`,
      helper: "Projects completed",
    },
  ];

  const bookingTrendData = nextSevenDayLabels.map((label, index) => ({
    label,
    count: bookingTrendCounts[index] ?? 0,
  }));

  return {
    heroMetrics,
    professionalMetrics,
    bookingTrendData,
  };
}
