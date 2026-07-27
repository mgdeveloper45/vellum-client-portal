import { describe, expect, it } from "vitest";
import { calculateRecommendationScore } from '../recommendation-score';

describe("calculateRecommendationScore", () => {
  it("produces deterministic scores", () => {
    const score = calculateRecommendationScore({
      id: "1",

      category: "FINANCE",

      severity: "HIGH",

      title: "",

      description: "",

      recommendation: "",

      impact: 50,

      confidence: 80,

      urgency: 40,
    });

    expect(score).toBe(230);
  });
});
