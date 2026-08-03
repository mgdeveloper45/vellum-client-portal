import type { ProjectDetailRecord } from "./project-repository";

export interface ProjectFinancialSummary {
  depositTotal: number;
  invoiceTotal: number;
  outstandingBalance: number;
}

export function buildProjectFinancialSummary(
  project: Pick<ProjectDetailRecord, "deposits" | "invoices">,
): ProjectFinancialSummary {
  const depositTotal = project.deposits.reduce(
    (total, deposit) => total + deposit.amount,
    0,
  );

  const invoiceTotal = project.invoices.reduce(
    (total, invoice) => total + invoice.amount,
    0,
  );

  return {
    depositTotal,
    invoiceTotal,
    outstandingBalance: invoiceTotal - depositTotal,
  };
}
