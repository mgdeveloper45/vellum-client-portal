import { describe, expect, it } from "vitest";
import type { DashboardContext } from "@/lib/services/dashboard/dashboard-context";
import { buildExecutivePrompt } from "../executive-prompt";

describe("buildExecutivePrompt", () => {
  it("includes executive overview", () => {
    const context: DashboardContext = {
      executiveContext: {
        summary: {
          overallHealth: 95,
          revenueHealth: 90,
          clientHealth: 92,
          workspaceHealth: 94,
          bookingHealth: 96,
          generatedAt: new Date(),
        },
        recommendations: [],
      },
      executiveBrief: {
        title: "Executive Brief",
        overview: "Business is healthy.",
        topRecommendations: [],
      },
      timeline: [],
    };

    const prompt = buildExecutivePrompt(context);

    expect(prompt).toContain("Business is healthy.");
    expect(prompt).toContain("Overall: 95");
  });
});