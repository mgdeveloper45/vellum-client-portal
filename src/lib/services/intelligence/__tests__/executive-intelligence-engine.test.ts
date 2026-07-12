import { describe, expect, it } from "vitest";
import {
  buildExecutiveIntelligence,
  type ExecutiveIntelligenceInput,
} from "../executive-intelligence-engine";

function createInput(
  overrides: Partial<ExecutiveIntelligenceInput> = {},
): ExecutiveIntelligenceInput {
  return {
    finance: {
      outstandingRevenue: 0,
      overdueInvoices: 0,
      collectionRate: 100,
      ...overrides.finance,
    },

    bookings: {
      todaysBookings: 3,
      nextSevenDaysBookings: 8,
      bookingsNeedingAttention: 0,
      ...overrides.bookings,
    },

    clients: {
      totalClients: 20,
      followUpsDue: 0,
      ...overrides.clients,
    },

    projects: {
      activeProjects: 4,
      pendingMilestones: 0,
      pendingProposals: 0,
      ...overrides.projects,
    },

    workspace: {
      healthScore: 90,
      ...overrides.workspace,
    },
  };
}

describe("buildExecutiveIntelligence", () => {
  it("prioritizes outstanding revenue", () => {
    const insights = buildExecutiveIntelligence(
      createInput({
        finance: {
          outstandingRevenue: 2450,
          overdueInvoices: 2,
          collectionRate: 80,
        },
      }),
    );

    expect(insights[0]).toMatchObject({
      id: "recover-outstanding-revenue",
      domain: "FINANCE",
      priority: "HIGH",
      href: "/invoices",
    });

    expect(insights[0].impact).toContain("$2,450");
  });

  it("creates client and project recommendations", () => {
    const insights = buildExecutiveIntelligence(
      createInput({
        clients: {
          totalClients: 20,
          followUpsDue: 3,
        },

        projects: {
          activeProjects: 4,
          pendingMilestones: 2,
          pendingProposals: 1,
        },
      }),
    );

    expect(
      insights.some((insight) => insight.id === "complete-client-follow-ups"),
    ).toBe(true);

    expect(
      insights.some((insight) => insight.id === "review-pending-milestones"),
    ).toBe(true);

    expect(
      insights.some((insight) => insight.id === "advance-pending-proposals"),
    ).toBe(true);
  });

  it("returns a low-priority healthy insight when no issues exist", () => {
    const insights = buildExecutiveIntelligence(createInput());

    expect(insights).toHaveLength(1);

    expect(insights[0]).toMatchObject({
      id: "maintain-business-momentum",
      priority: "LOW",
    });
  });

  it("orders high-priority insights before medium-priority insights", () => {
    const insights = buildExecutiveIntelligence(
      createInput({
        finance: {
          outstandingRevenue: 1000,
          overdueInvoices: 1,
          collectionRate: 60,
        },

        clients: {
          totalClients: 20,
          followUpsDue: 2,
        },
      }),
    );

    expect(insights[0].priority).toBe("HIGH");

    const firstMediumIndex = insights.findIndex(
      (insight) => insight.priority === "MEDIUM",
    );

    expect(firstMediumIndex).toBeGreaterThan(0);
  });
});
