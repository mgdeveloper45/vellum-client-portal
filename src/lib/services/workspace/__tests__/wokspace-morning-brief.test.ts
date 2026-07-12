import { describe, expect, it } from "vitest";
import { buildWorkspaceMorningBrief } from "../workspace-morning-brief";

describe("buildWorkspaceMorningBrief", () => {
  it("returns a complete executive briefing", () => {
    const brief = buildWorkspaceMorningBrief({
      firstName: "Marcus",

      yesterday: {
        revenue: 4200,
        completedBookings: 8,
        newClients: 2,
        proposalsAccepted: 1,
      },

      today: {
        appointments: 6,
        overdueInvoices: 1,
        followUps: 3,
      },

      estimatedRevenue: 5200,
    });

    expect(brief.greeting).toContain("Marcus");
    expect(brief.yesterday.revenue).toBe(4200);
    expect(brief.today.appointments).toBe(6);
    expect(brief.estimatedRevenue).toBe(5200);
    expect(brief.executiveSummary).toContain("Collections");
    expect(brief.recommendations.length).toBeGreaterThan(0);
  });

  it("returns a healthy recommendation when no urgent work exists", () => {
    const brief = buildWorkspaceMorningBrief({
      firstName: null,

      yesterday: {
        revenue: 0,
        completedBookings: 0,
        newClients: 0,
        proposalsAccepted: 0,
      },

      today: {
        appointments: 0,
        overdueInvoices: 0,
        followUps: 0,
      },

      estimatedRevenue: 0,
    });

    expect(brief.greeting).toBe("Good morning.");
    expect(brief.recommendations).toHaveLength(1);
    expect(brief.executiveSummary).toContain("operating normally");
  });
});
