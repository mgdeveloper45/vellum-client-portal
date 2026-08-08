import type { AiTool } from "./tool";
import type { ToolId } from "./tool-id";

import { draftInvoiceReminderEmail } from "@/lib/services/ai/email-drafter";

export class DraftEmailTool
  implements
    AiTool<
      Parameters<typeof draftInvoiceReminderEmail>[0],
      string
    >
{
  readonly id: ToolId = "DRAFT_EMAIL";

  async execute(
    input: Parameters<typeof draftInvoiceReminderEmail>[0],
  ): Promise<string> {
    return draftInvoiceReminderEmail(input);
  }
}