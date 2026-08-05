import { describe, expect, it } from "vitest";

import { buildBusinessHealthScore } from "../business-health-score";
import type { ExecutiveIntelligence } from "@/lib/services/dashboard/executive-intelligence-builder";

function intelligence(strengths: number, risks: number): ExecutiveIntelligence {
  return {
    health: "GOOD",
    headline: "Executive Summary",
    strengths: Array.from(
      { length: strengths },
      (_, index) => `Strength ${index}`,
    ),
    risks: Array.from({ length: risks }, (_, index) => `Risk ${index}`),
    recommendations: [],
  };
}

describe("buildBusinessHealthScore", () => {
  it("returns an A for a healthy business", () => {
    const result = buildBusinessHealthScore(intelligence(2, 0));

    expect(result).toEqual({
      score: 100,
      grade: "A",
      color: "green",
    });
  });

  it("returns a B when score is between 75 and 89", () => {
    const result = buildBusinessHealthScore(intelligence(1, 2));

    expect(result.score).toBe(75);
    expect(result.grade).toBe("B");
    expect(result.color).toBe("blue");
  });

  it("returns a C when score is between 60 and 74", () => {
    const result = buildBusinessHealthScore(intelligence(1, 3));

    expect(result.score).toBe(60);
    expect(result.grade).toBe("C");
    expect(result.color).toBe("yellow");
  });

  it("returns a D when score falls below 60", () => {
    const result = buildBusinessHealthScore(intelligence(0, 4));

    expect(result.score).toBe(40);
    expect(result.grade).toBe("D");
    expect(result.color).toBe("red");
  });

  it("never returns a score above 100", () => {
    const result = buildBusinessHealthScore(intelligence(50, 0));

    expect(result.score).toBe(100);
  });

  it("never returns a score below zero", () => {
    const result = buildBusinessHealthScore(intelligence(0, 20));

    expect(result.score).toBe(0);
  });
});
