import type { AiActionHandler } from "../action-handler";
import type { AiActionResult } from "../action-result";

import { draftInvoiceReminderEmail } from "@/lib/services/ai/email-drafter";

export interface DraftInvoiceReminderRequest {
  clientName: string;
  projectName: string;
  amount: number;
  invoiceId: string;
  businessName: string;
}

export class RealDraftEmailHandler implements AiActionHandler {
  constructor(private readonly request: DraftInvoiceReminderRequest) {}

  async execute(): Promise<AiActionResult> {
    const draft = await draftInvoiceReminderEmail(this.request);

    return {
      success: true,
      message: draft,
    };
  }
}
