import { beforeEach, describe, expect, it, vi } from "vitest";

import "@/lib/testing/mocks/mock-executive-brief";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";
import {
  getOrCreateExecutiveBrief,
} from "@/lib/testing/mocks/mock-executive-brief";
import { buildCopilotContext } from "../../copilot-context-builder";
import { buildBookingResponse } from "../booking-response-builder";

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildBookingResponse", () => {
  it("builds a booking response", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildBookingResponse(context);

    expect(response.answer).toContain("Weekly booking utilization");

    expect(response.evidence.length).toBeGreaterThan(0);

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });

  it("includes utilization evidence", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildBookingResponse(context);

    expect(response.evidence).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Today's utilization"),
        expect.stringContaining("Tomorrow's utilization"),
        expect.stringContaining("Weekly utilization"),
      ]),
    );
  });

  it("returns booking recommendations", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildBookingResponse(context);

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });
});
