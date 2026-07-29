import { describe, expect, it } from "vitest";

import {
  buildExecutiveIntelligencePipeline,
  type ExecutiveIntelligencePipelineInput,
} from "../executive-intelligence-pipeline";

import {
  createBookingForecast,
  createInsight,
  createRevenueForecast,
  createWorkspaceCapacity,
} from "./fixtures";

function createInput(
  overrides: Partial<ExecutiveIntelligencePipelineInput> = {},
): ExecutiveIntelligencePipelineInput {
  return {
    revenueForecast: createRevenueForecast(),
    bookingForecast: createBookingForecast(),
    workspaceCapacity: createWorkspaceCapacity(),
    executiveInsights: [createInsight()],
    ...overrides,
  };
}

describe("buildExecutiveIntelligencePipeline", () => {
  it("combines intelligence engines into one result", () => {
    const pipeline = buildExecutiveIntelligencePipeline(createInput());

    expect(pipeline.revenueForecast.projectedRevenue).toBe(18000);
    expect(pipeline.bookingForecast.utilizationToday).toBe(75);
    expect(pipeline.workspaceCapacity.weeklyOpenSlots).toBe(13);

    expect(pipeline.executiveAdvice.length).toBeGreaterThan(0);
    expect(pipeline.topAdvice).not.toBeNull();

    expect(pipeline.recommendations).toHaveLength(
      pipeline.executiveAdvice.length,
    );

    expect(pipeline.summary.adviceCount).toBe(pipeline.executiveAdvice.length);

    expect(pipeline.summary.executiveScore).toBe(pipeline.executiveScore.score);

    expect(pipeline.summary.healthySignals).toBe(pipeline.strengths.length);

    expect(pipeline.summary.riskSignals).toBe(pipeline.risks.length);

    expect(pipeline.summary.opportunitySignals).toBe(
      pipeline.opportunities.length,
    );
  });

  it("returns the highest-scoring advice as top advice", () => {
    const pipeline = buildExecutiveIntelligencePipeline(
      createInput({
        revenueForecast: createRevenueForecast({
          revenueAtRisk: 9000,
          risk: "HIGH",
          trend: "DOWN",
        }),
      }),
    );

    expect(pipeline.topAdvice).toMatchObject({
      id: "protect-revenue-at-risk",
      priority: "CRITICAL",
    });

    expect(pipeline.summary.criticalAdviceCount).toBeGreaterThan(0);
  });

  it("returns healthy guidance when no urgent issues exist", () => {
    const pipeline = buildExecutiveIntelligencePipeline(
      createInput({
        revenueForecast: createRevenueForecast({
          revenueAtRisk: 0,
          risk: "LOW",
          trend: "STABLE",
        }),

        bookingForecast: createBookingForecast({
          risk: "LOW",
          trend: "STABLE",
        }),

        workspaceCapacity: createWorkspaceCapacity({
          weeklyOpenSlots: 0,
          estimatedOpenRevenue: 0,
          risk: "LOW",
          lowestUtilizationDay: null,
          highestUtilizationDay: null,
        }),
        executiveInsights: [],
      }),
    );

    expect(pipeline.executiveAdvice).toHaveLength(1);
    expect(pipeline.topAdvice).toMatchObject({
      id: "maintain-business-momentum",
      priority: "LOW",
    });
    expect(pipeline.summary.criticalAdviceCount).toBe(0);
    expect(pipeline.summary.highPriorityAdviceCount).toBe(0);
  });
});
