import { generateInvoiceReminderAction } from "./invoice-action";

import { prismaInvoiceRepository } from "@/lib/services/invoice/prisma-invoice-repository";

export type ExecuteInvoiceReminderResult =
  | {
      success: true;
      document: Awaited<ReturnType<typeof generateInvoiceReminderAction>>;
    }
  | {
      success: false;
      message: string;
    };

export async function executeInvoiceReminderAction(
  workspaceId: string,
): Promise<ExecuteInvoiceReminderResult> {
  const invoices = await prismaInvoiceRepository.findInvoices({
    workspaceId,
  });

  const unpaidInvoices = invoices.filter((invoice) => !invoice.paid);

  if (unpaidInvoices.length === 0) {
    return {
      success: false,
      message: "No unpaid invoices found.",
    };
  }

  if (unpaidInvoices.length > 1) {
    return {
      success: false,
      message:
        "Multiple unpaid invoices were found. Please specify which invoice you want to draft a reminder for.",
    };
  }

  const invoice = unpaidInvoices[0];

  const fullInvoice = await prismaInvoiceRepository.findInvoiceForPdf({
    invoiceId: invoice.id,
    workspaceId,
  });

  if (!fullInvoice) {
    return {
      success: false,
      message: "Invoice not found.",
    };
  }

  const businessName =
    fullInvoice.project.workspace?.companyName ??
    fullInvoice.project.workspace?.name ??
    "Vellum";

  const clientName =
    `${fullInvoice.project.client.firstName} ${fullInvoice.project.client.lastName}`.trim();

  const document = await generateInvoiceReminderAction({
    clientName,
    businessName,
    projectName: fullInvoice.project.name,
    invoiceId: fullInvoice.id,
    amount: fullInvoice.amount,
  });

  return {
    success: true,
    document,
  };
}
