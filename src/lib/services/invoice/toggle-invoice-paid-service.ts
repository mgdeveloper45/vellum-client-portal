import type {
  InvoiceMutationRecord,
  InvoiceRepository,
} from "./invoice-repository";

export type ToggleInvoicePaidServiceResult =
  | {
      success: true;
      invoice: InvoiceMutationRecord;
    }
  | {
      success: false;
      code: "INVOICE_NOT_FOUND";
    };

export class ToggleInvoicePaidService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async execute(input: {
    invoiceId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<ToggleInvoicePaidServiceResult> {
    const invoice = await this.invoiceRepository.findInvoiceForMutation(input);

    if (!invoice) {
      return {
        success: false,
        code: "INVOICE_NOT_FOUND",
      };
    }

    const updatedInvoice = await this.invoiceRepository.updateInvoicePaid({
      invoiceId: invoice.id,
      paid: !invoice.paid,
    });

    return {
      success: true,
      invoice: updatedInvoice,
    };
  }
}
