import { buildTimelineFromAuditLogs } from "@/lib/services/timeline/audit-log-timeline";

export type DashboardAuditLogInput = Parameters<
  typeof buildTimelineFromAuditLogs
>[0];

export type BuildDashboardOrchestratorInput = {
  firstName?: string | null;

  totalClients: number;
  activeProjects: number;
  completedProjects: number;
  totalProjects: number;

  openInvoices: number;
  totalInvoices: number;
  paidInvoices: number;

  revenueCollected: number;
  revenueOutstanding: number;

  pendingMilestones: number;
  approvedProposals: number;
  totalProposals: number;

  todaysBookings: number;
  upcomingBookings: number;

  bookingTrendCounts: number[];
  nextSevenDayLabels: string[];

  recentActivity: DashboardAuditLogInput;
};

export type DashboardMetrics = {
  collectionRate: number;
  proposalConversionRate: number;
  projectCompletionRate: number;
  pendingProposals: number;
};
