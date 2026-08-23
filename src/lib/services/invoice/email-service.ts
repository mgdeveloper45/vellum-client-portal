import { sendInvoicePaidEmail } from "@/lib/email";

type SendInvoiceReceiptParams = {
  email: string;
  clientName: string;
  businessName: string;
  projectName: string;
  amount: number;
  invoiceId: string;
};

export async function sendInvoiceReceipt({
  email,
  clientName,
  businessName,
  projectName,
  amount,
  invoiceId,
}: SendInvoiceReceiptParams) {
  await sendInvoicePaidEmail({
    email,
    clientName,
    businessName,
    projectName,
    amount: `$${amount.toLocaleString()}`,
    invoiceUrl: `${process.env.APP_URL}/invoices/${invoiceId}/pdf`,
  });
}
