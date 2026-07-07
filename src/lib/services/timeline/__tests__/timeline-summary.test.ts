import { describe, expect, it } from "vitest";
import { buildTimelineSummary } from "../timeline-summary";
import type { TimelineEvent } from "../timeline-types";

describe("buildTimelineSummary", () => {
  it("summarizes timeline events", () => {
    const events: TimelineEvent[] = [
      {
        id: "1",
        type: "FINANCE",
        title: "Invoice Paid",
        description: "",
        occurredAt: new Date("2026-07-01"),
        priority: "HIGH",
      },
      {
        id: "2",
        type: "BOOKING",
        title: "Booking Created",
        description: "",
        occurredAt: new Date("2026-07-02"),
        priority: "LOW",
      },
    ];

    const summary = buildTimelineSummary(events);

    expect(summary.totalEvents).toBe(2);
    expect(summary.highPriorityEvents).toBe(1);
    expect(summary.latestEvent?.id).toBe("2");
  });

  it("handles an empty timeline", () => {
    const summary = buildTimelineSummary([]);

    expect(summary.totalEvents).toBe(0);
    expect(summary.highPriorityEvents).toBe(0);
    expect(summary.latestEvent).toBeUndefined();
  });
});
