import type { Priority } from "../intelligence/priority";
import type { FinanceProfile } from "./finance-types";

export type FinanceOpportunity = {
  title: string;
  description: string;
  priority: Priority;
};

export function calculateFinanceOpportunities(
  profile: FinanceProfile,
): FinanceOpportunity[] {
  const opportunities: FinanceOpportunity[] = [];

  if (profile.outstandingRevenue > 0) {
    opportunities.push({
      title: "Collect Outstanding Revenue",
      description: `Follow up on $${profile.outstandingRevenue.toLocaleString()} in outstanding invoices.`,
      priority: "HIGH",
    });
  }

  if (profile.overdueInvoices >= 3) {
    opportunities.push({
      title: "Reduce Overdue Invoices",
      description: "Several invoices are overdue. Prioritize collections.",
      priority: "HIGH",
    });
  }

  if (
    profile.paidInvoices === profile.totalInvoices &&
    profile.totalInvoices > 0
  ) {
    opportunities.push({
      title: "Excellent Payment Performance",
      description:
        "All invoices have been paid. Consider rewarding repeat clients.",
      priority: "LOW",
    });
  }

  return opportunities;
}
