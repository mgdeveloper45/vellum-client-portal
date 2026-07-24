import type {
  InvoiceListRecord,
  InvoiceRepository,
} from "./invoice-repository";

export class GetInvoicesService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(input: {
    workspaceId: string;
    clientId?: string;
  }): Promise<InvoiceListRecord[]> {
    return this.invoiceRepository.findInvoices(input);
  }
}
