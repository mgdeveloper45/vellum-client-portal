import { describe, expect, it } from "vitest";

import { buildConversationPlan } from "../copilot-conversation-planner";

describe("buildConversationPlan", () => {
  it("plans revenue conversations", () => {
    expect(
      buildConversationPlan({
        topic: "REVENUE",
        query: "Revenue",
      }),
    ).toEqual({
      topics: [
        "REVENUE",
        "INVOICES",
        "RECOMMENDATIONS",
      ],
    });
  });

  it("plans booking conversations", () => {
    expect(
      buildConversationPlan({
        topic: "BOOKINGS",
        query: "Bookings",
      }),
    ).toEqual({
      topics: [
        "BOOKINGS",
        "CAPACITY",
      ],
    });
  });

  it("plans capacity conversations", () => {
    expect(
      buildConversationPlan({
        topic: "CAPACITY",
        query: "Capacity",
      }),
    ).toEqual({
      topics: [
        "CAPACITY",
        "BOOKINGS",
      ],
    });
  });

  it("plans invoice conversations", () => {
    expect(
      buildConversationPlan({
        topic: "INVOICES",
        query: "Invoices",
      }),
    ).toEqual({
      topics: [
        "INVOICES",
        "REVENUE",
      ],
    });
  });

  it("plans risk conversations", () => {
    expect(
      buildConversationPlan({
        topic: "RISKS",
        query: "Risk",
      }),
    ).toEqual({
      topics: [
        "RISKS",
        "RECOMMENDATIONS",
        "REVENUE",
        "BOOKINGS",
      ],
    });
  });

  it("plans client conversations", () => {
    expect(
      buildConversationPlan({
        topic: "CLIENTS",
        query: "Clients",
      }),
    ).toEqual({
      topics: [
        "CLIENTS",
        "RECOMMENDATIONS",
      ],
    });
  });

  it("plans project conversations", () => {
    expect(
      buildConversationPlan({
        topic: "PROJECTS",
        query: "Projects",
      }),
    ).toEqual({
      topics: [
        "PROJECTS",
        "RISKS",
      ],
    });
  });

  it("plans recommendation conversations", () => {
    expect(
      buildConversationPlan({
        topic: "RECOMMENDATIONS",
        query: "Recommendations",
      }),
    ).toEqual({
      topics: [
        "RECOMMENDATIONS",
        "RISKS",
      ],
    });
  });

  it("defaults to a general conversation", () => {
    expect(
      buildConversationPlan({
        topic: "GENERAL",
        query: "",
      }),
    ).toEqual({
      topics: [
        "GENERAL",
      ],
    });
  });
});