import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { buildCopilotContext } from "@/lib/services/copilot/copilot-context-builder";
import { buildCopilotAiResponse } from "../copilot-ai-service";

import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";

import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildCopilotAiResponse", () => {
  it("creates an AI executive response", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = await buildCopilotAiResponse(context, "How is revenue?");

    expect(response.answer.length).toBeGreaterThan(0);
  });
});
