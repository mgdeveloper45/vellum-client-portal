import type { ExecutiveSummary } from "./executive-summary";
import type { Recommendation } from "../intelligence/recommendation";

export type ExecutiveContext = {
  summary: ExecutiveSummary;
  recommendations: Recommendation[];
};

export function buildExecutiveContext(
  summary: ExecutiveSummary,
  recommendations: Recommendation[],
): ExecutiveContext {
  return {
    summary,
    recommendations,
  };
}
