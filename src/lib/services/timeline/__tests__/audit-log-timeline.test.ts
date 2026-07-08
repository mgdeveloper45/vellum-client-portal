import { describe, expect, it } from "vitest";
import { buildTimelineFromAuditLogs } from "../audit-log-timeline";

describe("buildTimelineFromAuditLogs", () => {
  it("builds timeline events from audit logs", () => {
    const events = buildTimelineFromAuditLogs([
      {
        id: "1",
        action: "INVOICE_PAID",
        entity: "Invoice",
        metadata: {
          amount: 1200,
        },
        createdAt: new Date("2026-07-01"),
      },
    ]);

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("invoice paid");
    expect(events[0].type).toBe("SYSTEM");
    expect(events[0].priority).toBe("LOW");
  });
});
