export type CheckoutInvoice = {
  id: string;
  amount: number;
  project: {
    name: string;
  };
};

export interface PaymentRepository {
  findUnpaidInvoiceForCheckout(input: {
    invoiceId: string;
    workspaceId: string;
  }): Promise<CheckoutInvoice | null>;
}
