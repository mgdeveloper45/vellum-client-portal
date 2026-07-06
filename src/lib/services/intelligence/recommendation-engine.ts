import {
  buildRecommendations,
  type Recommendation,
} from "./recommendation";

export function buildRecommendationEngine(
  ...sources: Recommendation[][]
) {
  return buildRecommendations(
    sources.flat(),
  );
}