export type WorkspaceRevenueOpportunity = {
  title: string;
  amount: number;
  invoices: number;
  urgency: "HIGH" | "MEDIUM" | "LOW";
};

type Input = {
  overdueInvoices: number;
  outstandingRevenue: number;
};

export function calculateRevenueOpportunity({
  overdueInvoices,
  outstandingRevenue,
}: Input): WorkspaceRevenueOpportunity {
  if (overdueInvoices > 0) {
    return {
      title: "Outstanding revenue available today",
      amount: outstandingRevenue,
      invoices: overdueInvoices,
      urgency: "HIGH",
    };
  }

  return {
    title: "No outstanding invoices",
    amount: 0,
    invoices: 0,
    urgency: "LOW",
  };
}
