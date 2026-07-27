import { buildExecutiveBrief } from "@/lib/services/ai/executive-brief";
import { buildExecutiveContext } from "@/lib/services/ai/executive-engine";
import { buildDashboardContext } from "@/lib/services/dashboard/dashboard-engine";
import type {
  BuildDashboardOrchestratorInput,
  DashboardMetrics,
} from "@/lib/services/dashboard/dashboard-orchestrator-types";
import { adaptExecutiveInsights } from "@/lib/services/intelligence/executive-insight-adapter";
import { buildExecutiveIntelligence } from "@/lib/services/intelligence/executive-intelligence-engine";
import { buildTimelineFromAuditLogs } from "@/lib/services/timeline/audit-log-timeline";

type WorkspaceEngine = ReturnType<
  typeof import("@/lib/services/workspace/workspace-engine").buildWorkspaceEngine
>;

type FinanceEngine = ReturnType<
  typeof import("@/lib/services/finance/finance-engine").buildFinanceEngine
>;

type DashboardExecutiveContextInput = Pick<
  BuildDashboardOrchestratorInput,
  | "totalClients"
  | "activeProjects"
  | "pendingMilestones"
  | "todaysBookings"
  | "upcomingBookings"
  | "revenueOutstanding"
  | "openInvoices"
  | "recentActivity"
> & {
  metrics: DashboardMetrics;
  workspaceEngine: WorkspaceEngine;
  financeEngine: FinanceEngine;
};

export function buildDashboardExecutiveContext({
  totalClients,
  activeProjects,
  pendingMilestones,
  todaysBookings,
  upcomingBookings,
  revenueOutstanding,
  openInvoices,
  recentActivity,
  metrics,
  workspaceEngine,
  financeEngine,
}: DashboardExecutiveContextInput) {
  const executiveInsights = buildExecutiveIntelligence({
    finance: {
      outstandingRevenue: revenueOutstanding,

      // Invoice currently has no dueDate.
      overdueInvoices: openInvoices,

      collectionRate: metrics.collectionRate,
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
      pendingProposals: metrics.pendingProposals,
    },

    workspace: {
      healthScore: workspaceEngine.health.score,
    },
  });

  const executiveInbox = adaptExecutiveInsights(executiveInsights);

  const timelineEvents = buildTimelineFromAuditLogs(recentActivity);

  const executiveContext = buildExecutiveContext(
    {
      overallHealth: Math.round(
        (workspaceEngine.health.score + financeEngine.health.score + 90 + 90) /
          4,
      ),

      revenueHealth: financeEngine.health.score,

      // These remain neutral placeholders until dedicated
      // client and booking health engines are introduced.
      clientHealth: 90,
      workspaceHealth: workspaceEngine.health.score,
      bookingHealth: 90,

      generatedAt: new Date(),
    },
    executiveInbox,
  );

  const executiveBrief = buildExecutiveBrief(executiveContext);

  const dashboardContext = buildDashboardContext({
    executiveContext,
    executiveBrief,
    timeline: timelineEvents,
  });

  return {
    executiveInsights,
    executiveInbox,
    executiveContext,
    executiveBrief,
    dashboardContext,
  };
}
