import { generateEmailAction } from "./email-action";
import { buildInvoiceReminderPrompt } from "../prompts/email-prompt-builder";

import type { AiGeneratedDocument } from "./action-types";

export interface InvoiceReminderActionParams {
  clientName: string;
  businessName: string;
  projectName: string;
  invoiceId: string;
  amount: number;
}

export async function generateInvoiceReminderAction(
  params: InvoiceReminderActionParams,
): Promise<AiGeneratedDocument> {
  const prompt = buildInvoiceReminderPrompt(params);

  return generateEmailAction({
    title: `Invoice Reminder • ${params.invoiceId}`,
    prompt,
  });
}
