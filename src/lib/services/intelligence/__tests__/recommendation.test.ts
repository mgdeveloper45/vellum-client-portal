import { describe, expect, it } from "vitest";
import { buildRecommendations } from "../recommendation";

describe("buildRecommendations", () => {
  it("returns recommendations sorted by priority", () => {
    const recommendations = [
      {
        id: "1",
        title: "Low task",
        description: "Low priority",
        priority: "LOW" as const,
        href: "/low",
        category: "WORKSPACE" as const,
      },
      {
        id: "2",
        title: "High task",
        description: "High priority",
        priority: "HIGH" as const,
        href: "/high",
        category: "FINANCE" as const,
      },
    ];

    expect(
      buildRecommendations(recommendations).map((item) => item.id),
    ).toEqual(["2", "1"]);
  });
});
