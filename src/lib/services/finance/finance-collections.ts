import type { FinanceProfile } from "./finance-types";

export type CollectionsSummary = {
  overdueInvoices: number;
  outstandingRevenue: number;
  requiresAttention: boolean;
};

export function calculateCollections(
  profile: FinanceProfile,
): CollectionsSummary {
  return {
    overdueInvoices: profile.overdueInvoices,
    outstandingRevenue: profile.outstandingRevenue,
    requiresAttention:
      profile.overdueInvoices > 0 || profile.outstandingRevenue > 0,
  };
}
