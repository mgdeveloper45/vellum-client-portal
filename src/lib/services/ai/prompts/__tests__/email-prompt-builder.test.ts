import { describe, expect, it } from "vitest";

import { buildInvoiceReminderPrompt } from "../email-prompt-builder";

describe("buildInvoiceReminderPrompt", () => {
  it("includes all invoice details", () => {
    const prompt = buildInvoiceReminderPrompt({
      clientName: "John Smith",
      businessName: "Vellum",
      projectName: "Kitchen Remodel",
      invoiceId: "INV-2041",
      amount: 2450,
    });

    expect(prompt).toContain("John Smith");
    expect(prompt).toContain("Vellum");
    expect(prompt).toContain("Kitchen Remodel");
    expect(prompt).toContain("INV-2041");
    expect(prompt).toContain("$2,450");
  });
});
