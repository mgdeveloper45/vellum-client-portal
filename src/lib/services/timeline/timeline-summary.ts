import type { TimelineEvent } from "./timeline-types";

export type TimelineSummary = {
  totalEvents: number;
  highPriorityEvents: number;
  latestEvent?: TimelineEvent;
};

export function buildTimelineSummary(events: TimelineEvent[]): TimelineSummary {
  const latestEvent =
    events.length > 0
      ? [...events].sort(
          (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
        )[0]
      : undefined;

  return {
    totalEvents: events.length,
    highPriorityEvents: events.filter((event) => event.priority === "HIGH")
      .length,
    latestEvent,
  };
}
