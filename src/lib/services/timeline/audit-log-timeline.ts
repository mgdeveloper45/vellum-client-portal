import type { TimelineEvent } from "./timeline-types";
import type { ActivityInput } from "@/lib/activity";

type AuditLogTimelineInput = ActivityInput & {
  id: string;
  createdAt: Date;
};

export function buildTimelineFromAuditLogs(
  logs: AuditLogTimelineInput[],
): TimelineEvent[] {
  return logs.map((log) => ({
    id: log.id,
    type: "SYSTEM",
    title: log.action.toLowerCase().replaceAll("_", " "),
    description: `${log.entity} activity recorded.`,
    occurredAt: log.createdAt,
    priority: "LOW",
    metadata: {
      action: log.action,
      entity: log.entity,
      metadata: log.metadata,
    },
  }));
}
