import { buildFinanceEngine } from "@/lib/services/finance/finance-engine";
import type {
  BuildDashboardOrchestratorInput,
  DashboardMetrics,
} from "@/lib/services/dashboard/dashboard-orchestrator-types";
import { buildWorkspaceEngine } from "@/lib/services/workspace/workspace-engine";

type DashboardEngineInput = Pick<
  BuildDashboardOrchestratorInput,
  | "openInvoices"
  | "todaysBookings"
  | "revenueOutstanding"
  | "completedProjects"
  | "revenueCollected"
  | "paidInvoices"
  | "totalInvoices"
> & {
  metrics: DashboardMetrics;
};

export function buildDashboardEngines({
  openInvoices,
  todaysBookings,
  revenueOutstanding,
  completedProjects,
  revenueCollected,
  paidInvoices,
  totalInvoices,
  metrics,
}: DashboardEngineInput) {
  const workspaceEngine = buildWorkspaceEngine({
    // Invoice currently has no dueDate, so this is
    // technically the unpaid-invoice count.
    overdueInvoices: openInvoices,

    todaysBookings,
    bookingsNeedingAttention: 0,
    outstandingRevenue: revenueOutstanding,
    pendingProposals: metrics.pendingProposals,
    completedProjects,
  });

  const financeEngine = buildFinanceEngine({
    totalRevenue: revenueCollected,
    outstandingRevenue: revenueOutstanding,

    // Invoice currently has no dueDate, so this is
    // technically the unpaid-invoice count.
    overdueInvoices: openInvoices,

    paidInvoices,
    totalInvoices,
  });

  return {
    workspaceEngine,
    financeEngine,
  };
}
