import { describe, expect, it } from "vitest";
import { buildClientEngine } from "../client-engine";

describe("buildClientEngine", () => {
  it("builds a complete intelligence profile", () => {
    const client = buildClientEngine({
      id: "1",
      name: "Marcus",
      email: "marcus@example.com",
      totalBookings: 6,
      totalRevenue: 2400,
      lastBookingAt: new Date(),
      averageBookingValue: 400,
    });

    expect(client.lifetimeValue).toBe(2400);

    expect(client.averageBookingValue).toBe(400);

    expect(client.health.status).toBe("EXCELLENT");

    expect(client.retention.risk).toBe("LOW");

    expect(client.opportunities.length).toBeGreaterThan(0);
  });
});
