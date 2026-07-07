import type { TimelineEvent } from "./timeline-types";
import { buildTimelineSummary } from "./timeline-summary";

export function sortTimelineEvents(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort(
    (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
  );
}

export function getLatestTimelineEvents(
  events: TimelineEvent[],
  limit = 5,
): TimelineEvent[] {
  return sortTimelineEvents(events).slice(0, limit);
}

export function buildTimelineEngine(events: TimelineEvent[]) {
  return {
    events: sortTimelineEvents(events),
    summary: buildTimelineSummary(events),
  };
}
