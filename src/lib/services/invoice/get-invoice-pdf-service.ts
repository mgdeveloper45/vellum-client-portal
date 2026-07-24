import type { InvoicePdfRecord, InvoiceRepository } from "./invoice-repository";

export class GetInvoicePdfService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(input: {
    invoiceId: string;
    workspaceId: string;
  }): Promise<InvoicePdfRecord | null> {
    return this.invoiceRepository.findInvoiceForPdf(input);
  }
}
