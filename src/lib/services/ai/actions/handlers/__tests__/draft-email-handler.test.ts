import { describe, expect, it, vi } from "vitest";

import { DraftEmailHandler } from "../draft-email-handler";

describe("DraftEmailHandler", () => {
  it("returns the drafted email", async () => {
    const draft = vi.fn().mockResolvedValue("Subject: Invoice Reminder");

    const handler = new DraftEmailHandler({
      draft,
    });

    const result = await handler.execute();

    expect(draft).toHaveBeenCalledTimes(1);

    expect(result.success).toBe(true);

    expect(result.message).toContain("Invoice Reminder");
  });
});
