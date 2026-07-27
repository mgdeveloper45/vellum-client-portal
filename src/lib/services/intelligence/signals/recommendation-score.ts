import { BusinessSignal, BusinessSignalSeverity } from "./signal-types";

const severityWeight: Record<BusinessSignalSeverity, number> = {
  LOW: 10,
  MEDIUM: 30,
  HIGH: 60,
  CRITICAL: 100,
};

export function calculateRecommendationScore(signal: BusinessSignal): number {
  return (
    severityWeight[signal.severity] +
    signal.impact +
    signal.urgency +
    signal.confidence
  );
}
