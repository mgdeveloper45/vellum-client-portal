import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { askWithPrompt } from "../../ai-service";

import {
  generateEmailAction,
} from "../email-action";

vi.mock("../../ai-service", () => ({
  askWithPrompt: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(
    askWithPrompt,
  ).mockResolvedValue(
    "Generated email body.",
  );
});

describe("generateEmailAction", () => {
  it("creates an email action", async () => {
    const result =
      await generateEmailAction({
        title: "Invoice Reminder",

        prompt:
          "Generate reminder",
      });

    expect(result.type)
      .toBe("EMAIL");

    expect(result.title)
      .toBe("Invoice Reminder");

    expect(result.content)
      .toBe("Generated email body.");

    expect(result.preview.length)
      .toBeGreaterThan(0);
  });
});