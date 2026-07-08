import { describe, expect, it } from "vitest";
import { buildTimelineFromRecommendations } from "../timeline-builder";

describe("buildTimelineFromRecommendations", () => {
  it("creates timeline events from recommendations", () => {
    const events = buildTimelineFromRecommendations([
      {
        id: "1",
        title: "Collect Invoice",
        description: "Invoice is overdue.",
        priority: "HIGH",
        category: "FINANCE",
        href: "/invoices",
      },
    ]);

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("Collect Invoice");
    expect(events[0].type).toBe("SYSTEM");
    expect(events[0].priority).toBe("HIGH");
  });
});
