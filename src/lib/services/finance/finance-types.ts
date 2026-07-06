export type FinanceHealthStatus = "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK";

export type FinanceProfile = {
  totalRevenue: number;
  outstandingRevenue: number;
  overdueInvoices: number;
  paidInvoices: number;
  totalInvoices: number;
};

export type FinanceHealthResult = {
  status: FinanceHealthStatus;
  score: number;
  reasons: string[];
};
