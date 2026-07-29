import { type ExecutiveAdvice } from "./executive-advisor/executive-advisor-engine";

export type ExecutiveRecommendation = {
  id: string;
  title: string;
  reason: string;
  impact: number;
  advice: ExecutiveAdvice;
};

function getRecommendationImpact(advice: ExecutiveAdvice): number {
  if (advice.estimatedImpact > 0) {
    return advice.estimatedImpact;
  }

  switch (advice.priority) {
    case "CRITICAL":
      return 100;

    case "HIGH":
      return 75;

    case "MEDIUM":
      return 50;

    default:
      return 25;
  }
}

export function buildRecommendations(
  executiveAdvice: ExecutiveAdvice[],
): ExecutiveRecommendation[] {
  return executiveAdvice.map((advice, index) => ({
    id: `recommendation-${index}`,
    title: advice.title,
    reason: advice.reason,
    impact: getRecommendationImpact(advice),
    advice,
  }));
}
