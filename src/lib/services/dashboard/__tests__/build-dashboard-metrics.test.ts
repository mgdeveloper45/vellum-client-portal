import { describe, expect, it } from "vitest";
import { buildDashboardMetrics } from '../build-dashboard-metrics';

describe("buildDashboardMetrics", () => {
  it("calculates dashboard percentages", () => {
    const result = buildDashboardMetrics({
      totalInvoices: 10,
      paidInvoices: 8,
      totalProposals: 5,
      approvedProposals: 3,
      totalProjects: 4,
      completedProjects: 1,
    });

    expect(result).toEqual({
      collectionRate: 80,
      proposalConversionRate: 60,
      projectCompletionRate: 25,
      pendingProposals: 2,
    });
  });

  it("returns zero percentages when totals are zero", () => {
    const result = buildDashboardMetrics({
      totalInvoices: 0,
      paidInvoices: 0,
      totalProposals: 0,
      approvedProposals: 0,
      totalProjects: 0,
      completedProjects: 0,
    });

    expect(result).toEqual({
      collectionRate: 0,
      proposalConversionRate: 0,
      projectCompletionRate: 0,
      pendingProposals: 0,
    });
  });

  it("does not return a negative pending proposal count", () => {
    const result = buildDashboardMetrics({
      totalInvoices: 0,
      paidInvoices: 0,
      totalProposals: 2,
      approvedProposals: 3,
      totalProjects: 0,
      completedProjects: 0,
    });

    expect(result.pendingProposals).toBe(0);
  });
});
