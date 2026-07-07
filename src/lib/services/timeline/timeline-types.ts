import type { Priority } from "../intelligence/priority";

export type TimelineEventType =
  "BOOKING" | "CLIENT" | "FINANCE" | "AUTOMATION" | "AI" | "SYSTEM";

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  occurredAt: Date;
  priority: Priority;
  metadata?: Record<string, unknown>;
};
