import { createInvoiceCheckoutSession } from "./stripe-payment-service";
import type { PaymentRepository } from "./payment-repository";

export type CreateInvoiceCheckoutResult =
  | {
      success: true;
      checkoutUrl: string;
    }
  | {
      success: false;
      code: "INVOICE_NOT_FOUND" | "CHECKOUT_NOT_CREATED";
    };

export class CreateInvoiceCheckoutService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(input: {
    invoiceId: string;
    workspaceId: string;
  }): Promise<CreateInvoiceCheckoutResult> {
    const invoice =
      await this.paymentRepository.findUnpaidInvoiceForCheckout(input);

    if (!invoice) {
      return {
        success: false,
        code: "INVOICE_NOT_FOUND",
      };
    }

    const checkout = await createInvoiceCheckoutSession({
      invoiceId: invoice.id,
      amount: invoice.amount,
      description: `Invoice for ${invoice.project.name}`,
    });

    if (!checkout.url) {
      return {
        success: false,
        code: "CHECKOUT_NOT_CREATED",
      };
    }

    return {
      success: true,
      checkoutUrl: checkout.url,
    };
  }
}
