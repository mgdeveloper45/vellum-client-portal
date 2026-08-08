import type { InvoiceRepository } from "./invoice-repository";

export interface InvoiceDashboardSummary {
  totalInvoices: number;

  paidInvoices: number;

  unpaidInvoices: number;

  totalRevenue: number;

  outstandingRevenue: number;
}

export class GetInvoiceDashboardSummaryService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(input: {
    workspaceId: string;
  }): Promise<InvoiceDashboardSummary> {
    const invoices = await this.invoiceRepository.findInvoices({
      workspaceId: input.workspaceId,
    });

    return {
      totalInvoices: invoices.length,

      paidInvoices: invoices.filter((invoice) => invoice.paid).length,

      unpaidInvoices: invoices.filter((invoice) => !invoice.paid).length,

      totalRevenue: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),

      outstandingRevenue: invoices
        .filter((invoice) => !invoice.paid)
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    };
  }
}
