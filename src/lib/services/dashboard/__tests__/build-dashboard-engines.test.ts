import { describe, expect, it, vi, beforeEach } from "vitest";

import { buildDashboardEngines } from "../build-dashboard-engines";

import { buildWorkspaceEngine } from "@/lib/services/workspace/workspace-engine";
import { buildFinanceEngine } from "@/lib/services/finance/finance-engine";

vi.mock("@/lib/services/workspace/workspace-engine", () => ({
  buildWorkspaceEngine: vi.fn(),
}));

vi.mock("@/lib/services/finance/finance-engine", () => ({
  buildFinanceEngine: vi.fn(),
}));

const mockWorkspaceEngine = {
  summary: "workspace",
};

const mockFinanceEngine = {
  summary: "finance",
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(buildWorkspaceEngine).mockReturnValue(mockWorkspaceEngine as never);

  vi.mocked(buildFinanceEngine).mockReturnValue(mockFinanceEngine as never);
});

describe("buildDashboardEngines", () => {
  it("builds both engines", () => {
    const metrics = {
      pendingProposals: 4,
    } as never;

    const result = buildDashboardEngines({
      openInvoices: 3,
      todaysBookings: 6,
      revenueOutstanding: 1200,
      completedProjects: 11,
      revenueCollected: 40000,
      paidInvoices: 28,
      totalInvoices: 31,
      metrics,
    });

    expect(buildWorkspaceEngine).toHaveBeenCalledTimes(1);
    expect(buildFinanceEngine).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      workspaceEngine: mockWorkspaceEngine,
      financeEngine: mockFinanceEngine,
    });
  });

  it("passes the correct values to the workspace engine", () => {
    const metrics = {
      pendingProposals: 9,
    } as never;

    buildDashboardEngines({
      openInvoices: 5,
      todaysBookings: 7,
      revenueOutstanding: 800,
      completedProjects: 15,
      revenueCollected: 25000,
      paidInvoices: 17,
      totalInvoices: 22,
      metrics,
    });

    expect(buildWorkspaceEngine).toHaveBeenCalledWith({
      overdueInvoices: 5,
      todaysBookings: 7,
      bookingsNeedingAttention: 0,
      outstandingRevenue: 800,
      pendingProposals: 9,
      completedProjects: 15,
    });
  });

  it("passes the correct values to the finance engine", () => {
    const metrics = {
      pendingProposals: 3,
    } as never;

    buildDashboardEngines({
      openInvoices: 2,
      todaysBookings: 5,
      revenueOutstanding: 650,
      completedProjects: 10,
      revenueCollected: 55000,
      paidInvoices: 19,
      totalInvoices: 21,
      metrics,
    });

    expect(buildFinanceEngine).toHaveBeenCalledWith({
      totalRevenue: 55000,
      outstandingRevenue: 650,
      overdueInvoices: 2,
      paidInvoices: 19,
      totalInvoices: 21,
    });
  });

  it("returns mocked engine instances unchanged", () => {
    const metrics = {
      pendingProposals: 0,
    } as never;

    const result = buildDashboardEngines({
      openInvoices: 0,
      todaysBookings: 0,
      revenueOutstanding: 0,
      completedProjects: 0,
      revenueCollected: 0,
      paidInvoices: 0,
      totalInvoices: 0,
      metrics,
    });

    expect(result.workspaceEngine).toBe(mockWorkspaceEngine);
    expect(result.financeEngine).toBe(mockFinanceEngine);
  });
});
