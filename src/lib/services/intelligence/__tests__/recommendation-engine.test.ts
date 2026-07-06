import { describe, expect, it } from "vitest";
import { buildRecommendationEngine } from "../recommendation-engine";

describe("buildRecommendationEngine", () => {
  it("merges and sorts recommendations", () => {
    const recommendations = buildRecommendationEngine(
      [
        {
          id: "1",
          title: "Low",
          description: "",
          priority: "LOW",
          href: "/",
          category: "CLIENT",
        },
      ],
      [
        {
          id: "2",
          title: "Critical",
          description: "",
          priority: "CRITICAL",
          href: "/",
          category: "WORKSPACE",
        },
      ],
    );

    expect(recommendations).toHaveLength(2);
    expect(recommendations[0].id).toBe("2");
    expect(recommendations[1].id).toBe("1");
  });
});
