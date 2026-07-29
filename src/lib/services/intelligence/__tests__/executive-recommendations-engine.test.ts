import { describe, expect, it } from "vitest";
import { createAdvice } from "./fixtures";
import { buildRecommendations } from "../executive-recommendations-engine";

describe("buildRecommendations", () => {
  it("creates one recommendation for each advice item", () => {
    const advice = [
      createAdvice({ title: "First" }),
      createAdvice({ title: "Second" }),
    ];

    const recommendations = buildRecommendations(advice);

    expect(recommendations).toHaveLength(2);

    expect(recommendations[0].id).toBe("recommendation-0");
    expect(recommendations[1].id).toBe("recommendation-1");
  });

  it("copies the advice title and reason", () => {
    const advice = createAdvice({
      title: "Reduce cancellations",
      reason: "Cancellation rate has increased.",
    });

    const [recommendation] = buildRecommendations([advice]);

    expect(recommendation.advice).toBe(advice);
    expect(recommendation.title).toBe(advice.title);
    expect(recommendation.reason).toBe(advice.reason);
  });

  it("keeps a reference to the original advice", () => {
    const advice = createAdvice();

    const [recommendation] = buildRecommendations([advice]);

    expect(recommendation.advice).toBe(advice);
  });

  it("uses estimatedImpact when it is greater than zero", () => {
    const advice = createAdvice({
      priority: "LOW",
      estimatedImpact: 87,
    });

    const [recommendation] = buildRecommendations([advice]);

    expect(recommendation.impact).toBe(87);
  });

  it("defaults CRITICAL priority to an impact of 100", () => {
    const [recommendation] = buildRecommendations([
      createAdvice({
        priority: "CRITICAL",
        estimatedImpact: 0,
      }),
    ]);

    expect(recommendation.impact).toBe(100);
  });

  it("defaults HIGH priority to an impact of 75", () => {
    const [recommendation] = buildRecommendations([
      createAdvice({
        priority: "HIGH",
        estimatedImpact: 0,
      }),
    ]);

    expect(recommendation.impact).toBe(75);
  });

  it("defaults MEDIUM priority to an impact of 50", () => {
    const [recommendation] = buildRecommendations([
      createAdvice({
        priority: "MEDIUM",
        estimatedImpact: 0,
      }),
    ]);

    expect(recommendation.impact).toBe(50);
  });

  it("defaults LOW priority to an impact of 25", () => {
    const [recommendation] = buildRecommendations([
      createAdvice({
        priority: "LOW",
        estimatedImpact: 0,
      }),
    ]);

    expect(recommendation.impact).toBe(25);
  });

  it("returns an empty array when no advice is provided", () => {
    expect(buildRecommendations([])).toEqual([]);
  });
});
