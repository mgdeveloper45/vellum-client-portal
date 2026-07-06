import { clampScore } from "../intelligence/score";
import type { FinanceHealthResult, FinanceProfile } from "./finance-types";

export function calculateFinanceHealth(
  profile: FinanceProfile,
): FinanceHealthResult {
  let score = 100;
  const reasons: string[] = [];

  if (profile.outstandingRevenue > 0) {
    score -= 20;
    reasons.push("Outstanding revenue needs follow-up.");
  }

  if (profile.overdueInvoices > 0) {
    score -= profile.overdueInvoices * 10;
    reasons.push(
      `${profile.overdueInvoices} overdue invoice${profile.overdueInvoices === 1 ? "" : "s"}.`,
    );
  }

  if (profile.totalInvoices > 0 && profile.paidInvoices === 0) {
    score -= 20;
    reasons.push("No invoices have been paid yet.");
  }

  const normalizedScore = clampScore(score);

  return {
    score: normalizedScore,
    status:
      normalizedScore >= 85
        ? "HEALTHY"
        : normalizedScore >= 60
          ? "NEEDS_ATTENTION"
          : "AT_RISK",
    reasons:
      reasons.length > 0 ? reasons : ["Finance operations look healthy."],
  };
}
