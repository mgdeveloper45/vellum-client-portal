import type { FinanceProfile } from "./finance-types";

export type RevenueForecast = {
  projectedRevenue: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
};

export function calculateRevenueForecast(
  profile: FinanceProfile,
): RevenueForecast {
  const projectedRevenue = profile.totalRevenue + profile.outstandingRevenue;

  const collectionRate =
    profile.totalRevenue === 0
      ? 100
      : ((profile.totalRevenue - profile.outstandingRevenue) /
          profile.totalRevenue) *
        100;

  const confidence =
    collectionRate >= 90 ? "HIGH" : collectionRate >= 70 ? "MEDIUM" : "LOW";

  return {
    projectedRevenue,
    confidence,
  };
}
