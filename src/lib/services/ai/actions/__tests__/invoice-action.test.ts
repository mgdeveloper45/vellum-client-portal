import { beforeEach, describe, expect, it, vi } from "vitest";

import { askWithPrompt } from "../../ai-service";
import { generateInvoiceReminderAction } from "../invoice-action";

vi.mock("../../ai-service", () => ({
  askWithPrompt: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(askWithPrompt).mockResolvedValue("Invoice reminder email.");
});

describe("generateInvoiceReminderAction", () => {
  it("creates an invoice reminder", async () => {
    const result = await generateInvoiceReminderAction({
      clientName: "John Smith",
      businessName: "Vellum",
      projectName: "Kitchen Remodel",
      invoiceId: "INV-2041",
      amount: 2450,
    });

    expect(result.type).toBe("EMAIL");

    expect(result.title).toContain("INV-2041");

    expect(result.content).toContain("Invoice reminder");
  });
});
