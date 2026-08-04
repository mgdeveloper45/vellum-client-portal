import type { ExecutiveIntelligence } from "@/lib/services/dashboard/executive-intelligence-builder";

export interface BusinessHealthScore {
  score: number;

  grade: "A" | "B" | "C" | "D";

  color: "green" | "blue" | "yellow" | "red";
}

export function buildBusinessHealthScore(
  intelligence: ExecutiveIntelligence,
): BusinessHealthScore {
  let score = 100;

  score -= intelligence.risks.length * 15;

  score += intelligence.strengths.length * 5;

  score = Math.max(0, Math.min(100, score));

  if (score >= 90) {
    return {
      score,
      grade: "A",
      color: "green",
    };
  }

  if (score >= 75) {
    return {
      score,
      grade: "B",
      color: "blue",
    };
  }

  if (score >= 60) {
    return {
      score,
      grade: "C",
      color: "yellow",
    };
  }

  return {
    score,
    grade: "D",
    color: "red",
  };
}
