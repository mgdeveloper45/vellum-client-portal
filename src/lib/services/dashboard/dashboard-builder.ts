import type { DashboardQueryResult } from "@/lib/queries/dashboard/get-dashboard-query";
import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";
import { buildDashboardOrchestrator } from "@/lib/services/dashboard/dashboard-orchestrator";
import { buildExecutiveIntelligencePipeline } from "@/lib/services/intelligence/executive-intelligence-pipeline";
import { buildDashboardForecasts } from "@/lib/services/dashboard/dashboard-forecast-builder";

type BuildDashboardInput = {
  data: DashboardQueryResult;
};

export async function buildDashboard({ data }: BuildDashboardInput) {
  const {
    revenueCollected,
    revenueOutstanding,
    previousPeriodRevenue,
    upcomingBookingRevenue,
    workspaceCapacity,
    bookingForecast,
    revenueForecast,
  } = buildDashboardForecasts({
    data,
  });

  const dashboard = buildDashboardOrchestrator({
    firstName: data.firstName,
    totalClients: data.totalClients,
    activeProjects: data.activeProjects,
    completedProjects: data.completedProjects,
    totalProjects: data.totalProjects,
    openInvoices: data.openInvoices,
    totalInvoices: data.totalInvoices,
    paidInvoices: data.paidInvoices,
    revenueCollected,
    revenueOutstanding,
    pendingMilestones: data.pendingMilestones,
    approvedProposals: data.approvedProposals,
    totalProposals: data.totalProposals,
    todaysBookings: data.todaysBookings.length,
    upcomingBookings: data.upcomingBookings.length,
    bookingTrendCounts: data.bookingTrendCounts,
    nextSevenDayLabels: data.nextSevenDays.map((day) => day.label),
    recentActivity: data.recentActivity,
  });

  const executiveIntelligence = buildExecutiveIntelligencePipeline({
    revenueForecast,
    bookingForecast,
    workspaceCapacity,
    executiveInsights: dashboard.executiveInsights,
  });

  const aiResult = await getOrCreateExecutiveBrief({
    workspaceId: data.workspaceId,
    dashboardContext: dashboard.dashboardContext,
  });

  return {
    ...dashboard,
    revenueForecast,
    bookingForecast,
    workspaceCapacity,
    executiveIntelligence,
    executiveAdvice: executiveIntelligence.executiveAdvice,
    topAdvice: executiveIntelligence.topAdvice,
    aiResult,
    firstName: data.firstName,
    revenueCollected,
    revenueOutstanding,
    previousPeriodRevenue,
    upcomingBookingRevenue,
    todaysBookings: data.todaysBookings,
    upcomingBookings: data.upcomingBookings,
    recentActivity: data.recentActivity,
    recentNotifications: data.recentNotifications,
  };
}

export type DashboardViewModel = Awaited<ReturnType<typeof buildDashboard>>;
