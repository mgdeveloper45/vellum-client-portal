import { beforeEach, describe, expect, it, vi } from "vitest";

import * as drafter from "@/lib/services/ai/email-drafter";

import { DraftEmailTool } from "../draft-email-tool";

vi.mock("@/lib/services/ai/email-drafter");

describe("DraftEmailTool", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(drafter.draftInvoiceReminderEmail).mockResolvedValue(
      "Subject: Reminder",
    );
  });

  it("delegates to the email drafter", async () => {
    const tool = new DraftEmailTool();

    const result = await tool.execute({
      clientName: "John",

      projectName: "Kitchen",

      amount: 1000,

      invoiceId: "INV-1",

      businessName: "Vellum",
    });

    expect(drafter.draftInvoiceReminderEmail).toHaveBeenCalledTimes(1);

    expect(result).toContain("Reminder");
  });
});
