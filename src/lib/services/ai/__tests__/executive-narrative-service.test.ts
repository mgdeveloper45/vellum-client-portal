import { describe, expect, it } from "vitest";
import type { DashboardContext } from "@/lib/services/dashboard/dashboard-context";
import { ExecutiveNarrativeService } from "../executive-narrative-service";
import type { AiProvider } from "../ai-provider";

describe("ExecutiveNarrativeService", () => {
  it("delegates to the AI provider", async () => {
    const provider: AiProvider = {
      generateNarrative: async () => "Executive summary",
    };

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

    const service = new ExecutiveNarrativeService(provider);

    const result = await service.generate(context);

    expect(result).toBe("Executive summary");
  });
});
