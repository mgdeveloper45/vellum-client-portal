import type { BuildDashboardOrchestratorInput } from "@/lib/services/dashboard/dashboard-orchestrator-types";
import { buildWorkspaceMorningBrief } from "@/lib/services/workspace/workspace-morning-brief";

type DashboardMorningBriefInput = Pick<
  BuildDashboardOrchestratorInput,
  | "firstName"
  | "revenueCollected"
  | "completedProjects"
  | "totalClients"
  | "approvedProposals"
  | "todaysBookings"
  | "openInvoices"
  | "revenueOutstanding"
> & {
  executiveInboxCount: number;
};

export function buildDashboardMorningBrief({
  firstName,
  revenueCollected,
  completedProjects,
  totalClients,
  approvedProposals,
  todaysBookings,
  openInvoices,
  revenueOutstanding,
  executiveInboxCount,
}: DashboardMorningBriefInput) {
  return buildWorkspaceMorningBrief({
    firstName,

    yesterday: {
      revenue: revenueCollected,

      // Existing behavior is preserved. This currently
      // represents completed projects, not bookings.
      completedBookings: completedProjects,

      // Existing behavior is preserved. This currently
      // represents total clients, not yesterday's new clients.
      newClients: totalClients,

      // Existing behavior is preserved. This currently
      // represents all approved proposals.
      proposalsAccepted: approvedProposals,
    },

    today: {
      appointments: todaysBookings,

      // Invoice currently has no dueDate.
      overdueInvoices: openInvoices,

      followUps: executiveInboxCount,
    },

    estimatedRevenue: revenueCollected + revenueOutstanding,
  });
}
