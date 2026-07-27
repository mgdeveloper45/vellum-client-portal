import type {
  BuildDashboardOrchestratorInput,
  DashboardMetrics,
} from "@/lib/services/dashboard/dashboard-orchestrator-types";

type DashboardMetricsInput = Pick<
  BuildDashboardOrchestratorInput,
  | "totalInvoices"
  | "paidInvoices"
  | "totalProposals"
  | "approvedProposals"
  | "totalProjects"
  | "completedProjects"
>;

function calculatePercentage(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

export function buildDashboardMetrics({
  totalInvoices,
  paidInvoices,
  totalProposals,
  approvedProposals,
  totalProjects,
  completedProjects,
}: DashboardMetricsInput): DashboardMetrics {
  return {
    collectionRate: calculatePercentage(paidInvoices, totalInvoices),

    proposalConversionRate: calculatePercentage(
      approvedProposals,
      totalProposals,
    ),

    projectCompletionRate: calculatePercentage(
      completedProjects,
      totalProjects,
    ),

    pendingProposals: Math.max(0, totalProposals - approvedProposals),
  };
}
