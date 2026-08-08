import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateEmailAction } from "../email-action";
import { askWithPrompt } from "../../ai-service";

vi.mock("../../ai-service", () => ({
  askWithPrompt: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(askWithPrompt).mockResolvedValue("Generated email.");
});

describe("generateEmailAction", () => {
  it("returns generated email content", async () => {
    const result = await generateEmailAction({
      title: "Invoice Reminder",
      prompt: "Generate reminder",
    });

    expect(result).toEqual({
      title: "Invoice Reminder",
      content: "Generated email.",
    });
  });
});
