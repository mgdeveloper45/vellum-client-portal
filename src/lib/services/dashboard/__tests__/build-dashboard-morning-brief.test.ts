import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildDashboardMorningBrief } from "../build-dashboard-morning-brief";
import { buildWorkspaceMorningBrief } from "@/lib/services/workspace/workspace-morning-brief";

vi.mock("@/lib/services/workspace/workspace-morning-brief", () => ({
  buildWorkspaceMorningBrief: vi.fn(),
}));

const mockMorningBrief = {
  greeting: "Good morning Marcus",
  summary: "Everything looks healthy.",
};

describe("buildDashboardMorningBrief", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(buildWorkspaceMorningBrief).mockReturnValue(
      mockMorningBrief as never,
    );
  });

  it("delegates to buildWorkspaceMorningBrief", () => {
    buildDashboardMorningBrief({
      firstName: "Marcus",
      revenueCollected: 15000,
      completedProjects: 18,
      totalClients: 32,
      approvedProposals: 6,
      todaysBookings: 5,
      openInvoices: 4,
      revenueOutstanding: 2500,
      executiveInboxCount: 3,
    });

    expect(buildWorkspaceMorningBrief).toHaveBeenCalledTimes(1);
  });

  it("maps dashboard values into the workspace morning brief", () => {
    buildDashboardMorningBrief({
      firstName: "Marcus",
      revenueCollected: 15000,
      completedProjects: 18,
      totalClients: 32,
      approvedProposals: 6,
      todaysBookings: 5,
      openInvoices: 4,
      revenueOutstanding: 2500,
      executiveInboxCount: 3,
    });

    expect(buildWorkspaceMorningBrief).toHaveBeenCalledWith({
      firstName: "Marcus",

      yesterday: {
        revenue: 15000,
        completedBookings: 18,
        newClients: 32,
        proposalsAccepted: 6,
      },

      today: {
        appointments: 5,
        overdueInvoices: 4,
        followUps: 3,
      },

      estimatedRevenue: 17500,
    });
  });

  it("calculates estimated revenue", () => {
    buildDashboardMorningBrief({
      firstName: "Marcus",
      revenueCollected: 42000,
      completedProjects: 10,
      totalClients: 20,
      approvedProposals: 2,
      todaysBookings: 1,
      openInvoices: 3,
      revenueOutstanding: 8000,
      executiveInboxCount: 0,
    });

    expect(buildWorkspaceMorningBrief).toHaveBeenCalledWith(
      expect.objectContaining({
        estimatedRevenue: 50000,
      }),
    );
  });

  it("returns the workspace morning brief unchanged", () => {
    const result = buildDashboardMorningBrief({
      firstName: "Marcus",
      revenueCollected: 0,
      completedProjects: 0,
      totalClients: 0,
      approvedProposals: 0,
      todaysBookings: 0,
      openInvoices: 0,
      revenueOutstanding: 0,
      executiveInboxCount: 0,
    });

    expect(result).toBe(mockMorningBrief);
  });
});
