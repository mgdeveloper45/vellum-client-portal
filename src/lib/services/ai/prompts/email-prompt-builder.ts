export interface InvoiceReminderPromptParams {
  clientName: string;
  businessName: string;
  projectName: string;
  invoiceId: string;
  amount: number;
}

export function buildInvoiceReminderPrompt(
  params: InvoiceReminderPromptParams,
): string {
  return `
You are Vellum AI.

Draft a professional invoice reminder email.

Business:
${params.businessName}

Client:
${params.clientName}

Project:
${params.projectName}

Invoice:
${params.invoiceId}

Amount Due:
$${params.amount.toLocaleString()}

Requirements

- Friendly
- Professional
- Short
- Encourage payment
- Do not sound aggressive

Return only the email body.
`;
}
