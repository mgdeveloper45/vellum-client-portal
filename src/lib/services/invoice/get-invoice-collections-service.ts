import type {
  InvoiceListRecord,
  InvoiceRepository,
} from "./invoice-repository";

export interface InvoiceCollectionsSummary {
  invoices: InvoiceListRecord[];

  outstandingRevenue: number;

  paidRevenue: number;

  unpaidInvoices: InvoiceListRecord[];

  paidInvoices: InvoiceListRecord[];

  unpaidCount: number;

  paidCount: number;
}

export class GetInvoiceCollectionsService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(input: {
    workspaceId: string;
  }): Promise<InvoiceCollectionsSummary> {
    const invoices = await this.invoiceRepository.findInvoices({
      workspaceId: input.workspaceId,
    });

    const unpaidInvoices = invoices.filter((invoice) => !invoice.paid);

    const paidInvoices = invoices.filter((invoice) => invoice.paid);

    return {
      invoices,

      unpaidInvoices,

      paidInvoices,

      outstandingRevenue: unpaidInvoices.reduce(
        (sum, invoice) => sum + invoice.amount,
        0,
      ),

      paidRevenue: paidInvoices.reduce(
        (sum, invoice) => sum + invoice.amount,
        0,
      ),

      unpaidCount: unpaidInvoices.length,

      paidCount: paidInvoices.length,
    };
  }
}
