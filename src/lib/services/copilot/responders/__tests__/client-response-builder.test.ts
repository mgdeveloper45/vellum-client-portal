import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/lib/testing/mocks/mock-executive-brief";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";
import { getOrCreateExecutiveBrief } from "@/lib/testing/mocks/mock-executive-brief";
import { buildCopilotContext } from "../../copilot-context-builder";
import { buildClientResponse } from "../client-response-builder";

beforeEach(() => {
  vi.resetAllMocks();

  getOrCreateExecutiveBrief.mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildClientResponse", () => {
  it("builds a client response", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);
    const response = buildClientResponse(context);
    expect(response.answer.length).toBeGreaterThan(0);
    expect(response.evidence.length).toBeGreaterThan(0);
    expect(response.suggestedActions).toBeDefined();
  });
});