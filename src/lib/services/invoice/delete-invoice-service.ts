import type {
  InvoiceMutationRecord,
  InvoiceRepository,
} from "./invoice-repository";

export type DeleteInvoiceServiceResult =
  | {
      success: true;
      invoice: InvoiceMutationRecord;
    }
  | {
      success: false;
      code: "INVOICE_NOT_FOUND";
    };

export class DeleteInvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(input: {
    invoiceId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<DeleteInvoiceServiceResult> {
    const invoice = await this.invoiceRepository.findInvoiceForMutation(input);

    if (!invoice) {
      return {
        success: false,
        code: "INVOICE_NOT_FOUND",
      };
    }

    await this.invoiceRepository.deleteInvoice(invoice.id);

    return {
      success: true,
      invoice,
    };
  }
}
