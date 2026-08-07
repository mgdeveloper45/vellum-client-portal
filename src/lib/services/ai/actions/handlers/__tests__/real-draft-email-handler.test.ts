import { beforeEach, describe, expect, it, vi } from "vitest";

import { RealDraftEmailHandler } from "../real-draft-email-handler";

import * as emailDrafter from "@/lib/services/ai/email-drafter";

vi.mock("@/lib/services/ai/email-drafter");

describe("RealDraftEmailHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(emailDrafter.draftInvoiceReminderEmail).mockResolvedValue(
      "Subject: Reminder",
    );
  });

  it("uses the real email drafting service", async () => {
    const handler = new RealDraftEmailHandler({
      clientName: "John",

      projectName: "Kitchen Remodel",

      amount: 2500,

      invoiceId: "INV-001",

      businessName: "Vellum",
    });

    const result = await handler.execute();

    expect(emailDrafter.draftInvoiceReminderEmail).toHaveBeenCalledTimes(1);

    expect(result.success).toBe(true);

    expect(result.message).toContain("Reminder");
  });
});
