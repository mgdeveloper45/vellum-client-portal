import { describe, expect, it } from "vitest";
import {
  getLatestTimelineEvents,
  sortTimelineEvents,
} from "../timeline-engine";
import type { TimelineEvent } from "../timeline-types";

describe("timeline engine", () => {
  const events: TimelineEvent[] = [
    {
      id: "1",
      type: "FINANCE",
      title: "Invoice Paid",
      description: "Invoice #101 was paid.",
      occurredAt: new Date("2026-07-01T09:00:00"),
      priority: "HIGH",
    },
    {
      id: "2",
      type: "BOOKING",
      title: "Booking Created",
      description: "New booking was created.",
      occurredAt: new Date("2026-07-02T09:00:00"),
      priority: "MEDIUM",
    },
  ];

  it("sorts timeline events newest first", () => {
    const sorted = sortTimelineEvents(events);

    expect(sorted[0].id).toBe("2");
    expect(sorted[1].id).toBe("1");
  });

  it("returns latest timeline events with a limit", () => {
    const latest = getLatestTimelineEvents(events, 1);

    expect(latest).toHaveLength(1);
    expect(latest[0].id).toBe("2");
  });
});
