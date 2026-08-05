import { describe, expect, it } from "vitest";

import { routeCopilotQuestion } from "../copilot-question-router";

describe("routeCopilotQuestion", () => {
  it("routes revenue questions", () => {
    expect(routeCopilotQuestion("How is revenue?")).toMatchObject({
      topic: "REVENUE",
    });
  });

  it("routes booking questions", () => {
    expect(routeCopilotQuestion("How are bookings?")).toMatchObject({
      topic: "BOOKINGS",
    });
  });

  it("routes capacity questions", () => {
    expect(routeCopilotQuestion("How much capacity is left?")).toMatchObject({
      topic: "CAPACITY",
    });
  });

  it("routes invoice questions", () => {
    expect(routeCopilotQuestion("Which invoices are overdue?")).toMatchObject({
      topic: "INVOICES",
    });
  });

  it("defaults to GENERAL", () => {
    expect(routeCopilotQuestion("Hello")).toMatchObject({
      topic: "GENERAL",
    });
  });
});
