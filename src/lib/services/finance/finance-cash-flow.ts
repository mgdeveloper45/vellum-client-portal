import type { FinanceProfile } from "./finance-types";

export type CashFlowSummary = {
  availableRevenue: number;
  outstandingRevenue: number;
  collectionRate: number;
};

export function calculateCashFlow(profile: FinanceProfile): CashFlowSummary {
  const availableRevenue = profile.totalRevenue - profile.outstandingRevenue;

  const collectionRate =
    profile.totalRevenue === 0
      ? 100
      : Math.round((availableRevenue / profile.totalRevenue) * 100);

  return {
    availableRevenue,
    outstandingRevenue: profile.outstandingRevenue,
    collectionRate,
  };
}
