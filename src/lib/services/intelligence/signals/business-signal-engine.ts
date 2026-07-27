import { calculateRecommendationScore } from "./recommendation-score";
import { BusinessSignal } from "./signal-types";

export interface RankedBusinessSignal extends BusinessSignal {
  score: number;
}

export function rankBusinessSignals(
  signals: BusinessSignal[],
): RankedBusinessSignal[] {
  return signals
    .map((signal) => ({
      ...signal,
      score: calculateRecommendationScore(signal),
    }))
    .sort((a, b) => b.score - a.score);
}
