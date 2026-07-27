import { buildDashboardEngines } from "@/lib/services/dashboard/build-dashboard-engines";
import { buildDashboardExecutiveContext } from "@/lib/services/dashboard/build-dashboard-executive-context";
import { buildDashboardMetrics } from "@/lib/services/dashboard/build-dashboard-metrics";
import { buildDashboardMorningBrief } from "@/lib/services/dashboard/build-dashboard-morning-brief";
import { buildDashboardPresentation } from "@/lib/services/dashboard/build-dashboard-presentation";
import type { BuildDashboardOrchestratorInput } from "@/lib/services/dashboard/dashboard-orchestrator-types";

export function buildDashboardOrchestrator(
  input: BuildDashboardOrchestratorInput,
) {
  const metrics = buildDashboardMetrics({
    totalInvoices: input.totalInvoices,
    paidInvoices: input.paidInvoices,
    totalProposals: input.totalProposals,
    approvedProposals: input.approvedProposals,
    totalProjects: input.totalProjects,
    completedProjects: input.completedProjects,
  });

  const { workspaceEngine, financeEngine } = buildDashboardEngines({
    openInvoices: input.openInvoices,
    todaysBookings: input.todaysBookings,
    revenueOutstanding: input.revenueOutstanding,
    completedProjects: input.completedProjects,
    revenueCollected: input.revenueCollected,
    paidInvoices: input.paidInvoices,
    totalInvoices: input.totalInvoices,
    metrics,
  });

  const {
    executiveInsights,
    executiveInbox,
    executiveContext,
    executiveBrief,
    dashboardContext,
  } = buildDashboardExecutiveContext({
    totalClients: input.totalClients,
    activeProjects: input.activeProjects,
    pendingMilestones: input.pendingMilestones,
    todaysBookings: input.todaysBookings,
    upcomingBookings: input.upcomingBookings,
    revenueOutstanding: input.revenueOutstanding,
    openInvoices: input.openInvoices,
    recentActivity: input.recentActivity,
    metrics,
    workspaceEngine,
    financeEngine,
  });

  const morningBrief = buildDashboardMorningBrief({
    firstName: input.firstName,
    revenueCollected: input.revenueCollected,
    completedProjects: input.completedProjects,
    totalClients: input.totalClients,
    approvedProposals: input.approvedProposals,
    todaysBookings: input.todaysBookings,
    openInvoices: input.openInvoices,
    revenueOutstanding: input.revenueOutstanding,
    executiveInboxCount: executiveInbox.length,
  });

  const { heroMetrics, professionalMetrics, bookingTrendData } =
    buildDashboardPresentation({
      todaysBookings: input.todaysBookings,
      activeProjects: input.activeProjects,
      pendingMilestones: input.pendingMilestones,
      openInvoices: input.openInvoices,
      totalClients: input.totalClients,
      revenueCollected: input.revenueCollected,
      revenueOutstanding: input.revenueOutstanding,
      bookingTrendCounts: input.bookingTrendCounts,
      nextSevenDayLabels: input.nextSevenDayLabels,
      metrics,
    });

  return {
    workspaceEngine,
    financeEngine,

    executiveInsights,
    executiveInbox,
    executiveContext,
    executiveBrief,
    dashboardContext,

    morningBrief,

    heroMetrics,
    professionalMetrics,
    bookingTrendData,

    metrics,
  };
}
