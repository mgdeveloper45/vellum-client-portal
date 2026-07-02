import { askAI } from "@/lib/services/ai/ai-service";

type DraftInvoiceReminderParams = {
  clientName: string;
  projectName: string;
  amount: number;
  invoiceId: string;
  businessName: string;
};

export async function draftInvoiceReminderEmail({
  clientName,
  projectName,
  amount,
  invoiceId,
  businessName,
}: DraftInvoiceReminderParams) {
  const prompt = `
You are Vellum AI.

Draft a polite, professional invoice reminder email.

Details:
Client: ${clientName}
Business: ${businessName}
Project: ${projectName}
Invoice ID: ${invoiceId}
Amount Due: $${amount.toLocaleString()}

Return only:
Subject:
Email:
`;

  if (process.env.AI_MOCK_MODE === "true") {
    return `Subject:
Friendly reminder: Invoice payment for ${projectName}

Email:
Hi ${clientName},

I hope you're doing well.

This is a friendly reminder that the invoice for ${projectName} in the amount of $${amount.toLocaleString()} is still outstanding.

If you've already sent payment, please disregard this message.

Thank you,
${businessName}`;
  }

  return askAI(prompt);
}
