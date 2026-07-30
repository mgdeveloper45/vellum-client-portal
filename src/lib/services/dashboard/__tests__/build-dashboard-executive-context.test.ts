import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildDashboardExecutiveContext } from "../build-dashboard-executive-context";

import { buildExecutiveIntelligence } from "@/lib/services/intelligence/executive-intelligence-engine";
import { adaptExecutiveInsights } from "@/lib/services/intelligence/executive-insight-adapter";
import { buildTimelineFromAuditLogs } from "@/lib/services/timeline/audit-log-timeline";
import { buildExecutiveContext } from "@/lib/services/ai/executive-engine";
import { buildExecutiveBrief } from "@/lib/services/ai/executive-brief";
import { buildDashboardContext } from "@/lib/services/dashboard/dashboard-engine";

vi.mock("@/lib/services/intelligence/executive-intelligence-engine", () => ({
  buildExecutiveIntelligence: vi.fn(),
}));

vi.mock("@/lib/services/intelligence/executive-insight-adapter", () => ({
  adaptExecutiveInsights: vi.fn(),
}));

vi.mock("@/lib/services/timeline/audit-log-timeline", () => ({
  buildTimelineFromAuditLogs: vi.fn(),
}));

vi.mock("@/lib/services/ai/executive-engine", () => ({
  buildExecutiveContext: vi.fn(),
}));

vi.mock("@/lib/services/ai/executive-brief", () => ({
  buildExecutiveBrief: vi.fn(),
}));

vi.mock("@/lib/services/dashboard/dashboard-engine", () => ({
  buildDashboardContext: vi.fn(),
}));

const executiveInsights = [{ id: "insight-1" }];
const executiveInbox = [{ id: "advice-1" }];
const timeline = [{ id: "timeline-1" }];
const executiveContext = { id: "context" };
const executiveBrief = { id: "brief" };
const dashboardContext = { id: "dashboard-context" };

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(buildExecutiveIntelligence).mockReturnValue(
    executiveInsights as never,
  );

  vi.mocked(adaptExecutiveInsights).mockReturnValue(executiveInbox as never);

  vi.mocked(buildTimelineFromAuditLogs).mockReturnValue(timeline as never);

  vi.mocked(buildExecutiveContext).mockReturnValue(executiveContext as never);

  vi.mocked(buildExecutiveBrief).mockReturnValue(executiveBrief as never);

  vi.mocked(buildDashboardContext).mockReturnValue(dashboardContext as never);
});

describe("buildDashboardExecutiveContext", () => {
  const metrics = {
    collectionRate: 91,
    proposalConversionRate: 70,
    projectCompletionRate: 84,
    pendingProposals: 6,
  };

  const workspaceEngine = {
    health: {
      score: 80,
    },
  };

  const financeEngine = {
    health: {
      score: 88,
    },
  };

  it("builds executive intelligence", () => {
    buildDashboardExecutiveContext({
      totalClients: 40,
      activeProjects: 12,
      pendingMilestones: 5,
      todaysBookings: 3,
      upcomingBookings: 18,
      revenueOutstanding: 4200,
      openInvoices: 4,
      recentActivity: [],
      metrics,
      workspaceEngine: workspaceEngine as never,
      financeEngine: financeEngine as never,
    });

    expect(buildExecutiveIntelligence).toHaveBeenCalledWith({
      finance: {
        outstandingRevenue: 4200,
        overdueInvoices: 4,
        collectionRate: 91,
      },

      bookings: {
        todaysBookings: 3,
        nextSevenDaysBookings: 18,
        bookingsNeedingAttention: 0,
      },

      clients: {
        totalClients: 40,
        followUpsDue: 0,
      },

      projects: {
        activeProjects: 12,
        pendingMilestones: 5,
        pendingProposals: 6,
      },

      workspace: {
        healthScore: 80,
      },
    });
  });

  it("calculates overall health", () => {
    buildDashboardExecutiveContext({
      totalClients: 1,
      activeProjects: 1,
      pendingMilestones: 1,
      todaysBookings: 1,
      upcomingBookings: 1,
      revenueOutstanding: 1,
      openInvoices: 1,
      recentActivity: [],
      metrics,
      workspaceEngine: workspaceEngine as never,
      financeEngine: financeEngine as never,
    });

    expect(buildExecutiveContext).toHaveBeenCalledWith(
      expect.objectContaining({
        overallHealth: 87,
        revenueHealth: 88,
        workspaceHealth: 80,
        clientHealth: 90,
        bookingHealth: 90,
        generatedAt: expect.any(Date),
      }),
      executiveInbox,
    );
  });

  it("builds the executive brief and dashboard context", () => {
    buildDashboardExecutiveContext({
      totalClients: 1,
      activeProjects: 1,
      pendingMilestones: 1,
      todaysBookings: 1,
      upcomingBookings: 1,
      revenueOutstanding: 1,
      openInvoices: 1,
      recentActivity: [],
      metrics,
      workspaceEngine: workspaceEngine as never,
      financeEngine: financeEngine as never,
    });

    expect(buildExecutiveBrief).toHaveBeenCalledWith(executiveContext);

    expect(buildDashboardContext).toHaveBeenCalledWith({
      executiveContext,
      executiveBrief,
      timeline,
    });
  });

  it("returns the composed dashboard context", () => {
    const result = buildDashboardExecutiveContext({
      totalClients: 1,
      activeProjects: 1,
      pendingMilestones: 1,
      todaysBookings: 1,
      upcomingBookings: 1,
      revenueOutstanding: 1,
      openInvoices: 1,
      recentActivity: [],
      metrics,
      workspaceEngine: workspaceEngine as never,
      financeEngine: financeEngine as never,
    });

    expect(result).toEqual({
      executiveInsights,
      executiveInbox,
      executiveContext,
      executiveBrief,
      dashboardContext,
    });
  });
});
