import { buildExecutiveBrief } from "@/lib/services/ai/executive-brief";
import { buildExecutiveContext } from "@/lib/services/ai/executive-engine";
import { buildDashboardContext } from "@/lib/services/dashboard/dashboard-engine";
import { buildFinanceEngine } from "@/lib/services/finance/finance-engine";
import { adaptExecutiveInsights } from "@/lib/services/intelligence/executive-insight-adapter";
import { buildExecutiveIntelligence } from "@/lib/services/intelligence/executive-intelligence-engine";
import { buildTimelineFromAuditLogs } from "@/lib/services/timeline/audit-log-timeline";
import { buildWorkspaceEngine } from "@/lib/services/workspace/workspace-engine";
import { buildWorkspaceMorningBrief } from "@/lib/services/workspace/workspace-morning-brief";

type AuditLogInput = Parameters<
  typeof buildTimelineFromAuditLogs
>[0];

type BuildDashboardOrchestratorInput = {
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

  recentActivity: AuditLogInput;
};

export function buildDashboardOrchestrator({
  firstName,
  totalClients,
  activeProjects,
  completedProjects,
  totalProjects,
  openInvoices,
  totalInvoices,
  paidInvoices,
  revenueCollected,
  revenueOutstanding,
  pendingMilestones,
  approvedProposals,
  totalProposals,
  todaysBookings,
  upcomingBookings,
  bookingTrendCounts,
  nextSevenDayLabels,
  recentActivity,
}: BuildDashboardOrchestratorInput) {
  const collectionRate =
    totalInvoices === 0
      ? 0
      : Math.round((paidInvoices / totalInvoices) * 100);

  const proposalConversionRate =
    totalProposals === 0
      ? 0
      : Math.round(
          (approvedProposals / totalProposals) * 100,
        );

  const projectCompletionRate =
    totalProjects === 0
      ? 0
      : Math.round(
          (completedProjects / totalProjects) * 100,
        );

  const pendingProposals =
    totalProposals - approvedProposals;

  const workspaceEngine = buildWorkspaceEngine({
    overdueInvoices: openInvoices,
    todaysBookings,
    bookingsNeedingAttention: 0,
    outstandingRevenue: revenueOutstanding,
    pendingProposals,
    completedProjects,
  });

  const financeEngine = buildFinanceEngine({
    totalRevenue: revenueCollected,
    outstandingRevenue: revenueOutstanding,
    overdueInvoices: openInvoices,
    paidInvoices,
    totalInvoices,
  });

  const executiveInsights =
    buildExecutiveIntelligence({
      finance: {
        outstandingRevenue: revenueOutstanding,
        overdueInvoices: openInvoices,
        collectionRate,
      },

      bookings: {
        todaysBookings,
        nextSevenDaysBookings: upcomingBookings,
        bookingsNeedingAttention: 0,
      },

      clients: {
        totalClients,
        followUpsDue: 0,
      },

      projects: {
        activeProjects,
        pendingMilestones,
        pendingProposals,
      },

      workspace: {
        healthScore: workspaceEngine.health.score,
      },
    });

  const executiveInbox =
    adaptExecutiveInsights(executiveInsights);

  const timelineEvents =
    buildTimelineFromAuditLogs(recentActivity);

  const executiveContext = buildExecutiveContext(
    {
      overallHealth: Math.round(
        (
          workspaceEngine.health.score +
          financeEngine.health.score +
          90 +
          90
        ) / 4,
      ),
      revenueHealth: financeEngine.health.score,
      clientHealth: 90,
      workspaceHealth: workspaceEngine.health.score,
      bookingHealth: 90,
      generatedAt: new Date(),
    },
    executiveInbox,
  );

  const executiveBrief =
    buildExecutiveBrief(executiveContext);

  const dashboardContext = buildDashboardContext({
    executiveContext,
    executiveBrief,
    timeline: timelineEvents,
  });

  const morningBrief = buildWorkspaceMorningBrief({
    firstName,

    yesterday: {
      revenue: revenueCollected,
      completedBookings: completedProjects,
      newClients: totalClients,
      proposalsAccepted: approvedProposals,
    },

    today: {
      appointments: todaysBookings,
      overdueInvoices: openInvoices,
      followUps: executiveInbox.length,
    },

    estimatedRevenue:
      revenueCollected + revenueOutstanding,
  });

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
      value: `$${revenueCollected.toLocaleString()}`,
      helper: "Paid invoices",
    },
    {
      label: "Outstanding Revenue",
      value: `$${revenueOutstanding.toLocaleString()}`,
      helper: "Awaiting payment",
    },
    {
      label: "Collection Rate",
      value: `${collectionRate}%`,
      helper: "Invoices paid",
    },
    {
      label: "Proposal Conversion",
      value: `${proposalConversionRate}%`,
      helper: "Proposals approved",
    },
    {
      label: "Project Completion",
      value: `${projectCompletionRate}%`,
      helper: "Projects completed",
    },
  ];

  const bookingTrendData =
    nextSevenDayLabels.map((label, index) => ({
      label,
      count: bookingTrendCounts[index] ?? 0,
    }));

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
    metrics: {
      collectionRate,
      proposalConversionRate,
      projectCompletionRate,
      pendingProposals,
    },
  };
}