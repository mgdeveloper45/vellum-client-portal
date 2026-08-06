import { describe, expect, it } from "vitest";

import { mergeCopilotResponses } from "../copilot-response-merger";

describe("mergeCopilotResponses", () => {
  it("merges multiple copilot responses", () => {
    const merged = mergeCopilotResponses([
      {
        answer: "Revenue is healthy.",

        evidence: ["Revenue: $18,000", "Outstanding: $3,000"],

        suggestedActions: ["Review invoices"],
      },

      {
        answer: "Bookings remain strong.",

        evidence: ["Weekly utilization: 82%", "Revenue: $18,000"],

        suggestedActions: ["Review invoices", "Increase marketing"],
      },
    ]);

    expect(merged.answer).toContain("Revenue is healthy.");

    expect(merged.answer).toContain("Bookings remain strong.");

    expect(merged.evidence).toEqual([
      "Revenue: $18,000",
      "Outstanding: $3,000",
      "Weekly utilization: 82%",
    ]);

    expect(merged.suggestedActions).toEqual([
      "Review invoices",
      "Increase marketing",
    ]);
  });

  it("returns empty collections when nothing is provided", () => {
    const merged = mergeCopilotResponses([]);

    expect(merged.answer).toBe("");

    expect(merged.evidence).toEqual([]);

    expect(merged.suggestedActions).toEqual([]);
  });

  it("removes duplicate evidence and actions", () => {
    const merged = mergeCopilotResponses([
      {
        answer: "One",

        evidence: ["A", "B"],

        suggestedActions: ["X"],
      },

      {
        answer: "Two",

        evidence: ["A", "C"],

        suggestedActions: ["X", "Y"],
      },
    ]);

    expect(merged.evidence).toEqual(["A", "B", "C"]);

    expect(merged.suggestedActions).toEqual(["X", "Y"]);
  });
});
