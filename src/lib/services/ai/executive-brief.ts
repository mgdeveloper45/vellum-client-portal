import type { ExecutiveContext } from "./executive-engine";

export type ExecutiveBrief = {
  title: string;
  overview: string;
  topRecommendations: string[];
};

export function buildExecutiveBrief(context: ExecutiveContext): ExecutiveBrief {
  return {
    title: "Executive Daily Brief",

    overview: `Overall platform health is ${context.summary.overallHealth}/100.`,

    topRecommendations: context.recommendations.map(
      (recommendation) => recommendation.title,
    ),
  };
}
