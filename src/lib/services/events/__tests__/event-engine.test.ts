import { describe, expect, it } from "vitest";
import { createPlatformEvent } from "../event-engine";

describe("createPlatformEvent", () => {
  it("creates an event", () => {
    const event = createPlatformEvent("BOOKING_CREATED", "booking-123", {
      customer: "Alice",
    });

    expect(event.trigger).toBe("BOOKING_CREATED");
    expect(event.entityId).toBe("booking-123");
    expect(event.payload?.customer).toBe("Alice");
    expect(event.occurredAt).toBeInstanceOf(Date);
  });
});
