import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";

import { buildCopilotContext } from "@/lib/services/copilot/copilot-context-builder";

import { buildCopilotAiResponse } from "../copilot-ai-service";

import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";

import * as aiService from "../ai-service";

import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn(),
}));

vi.mock("../ai-service");

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });

  vi.mocked(aiService.askCopilot).mockResolvedValue("Revenue is healthy.");
});

describe("buildCopilotAiResponse", () => {
  it("creates an AI executive response with citations", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = await buildCopilotAiResponse(context, "How is revenue?");

    expect(response.answer).toContain("Revenue is healthy.");

    expect(response.answer).toContain("Evidence");

    expect(response.answer).toContain("Executive Score");

    expect(response.answer).toContain("Revenue Risk");
  });
});
