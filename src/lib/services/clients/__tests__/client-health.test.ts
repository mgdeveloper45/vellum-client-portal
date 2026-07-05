import { describe, expect, it } from "vitest";
import { calculateClientHealth } from "../client-health";

describe("calculateClientHealth", () => {
  it("returns EXCELLENT for a strong client", () => {
    const result = calculateClientHealth({
      id: "1",
      name: "Premium Client",
      email: "premium@example.com",
      totalBookings: 8,
      totalRevenue: 4000,
      lastBookingAt: new Date(),
      averageBookingValue: 500,
    });

    expect(result.status).toBe("EXCELLENT");
    expect(result.score).toBe(100);
  });

  it("flags a new client", () => {
    const result = calculateClientHealth({
      id: "2",
      name: "New Client",
      email: "new@example.com",
      totalBookings: 0,
      totalRevenue: 0,
      lastBookingAt: null,
      averageBookingValue: 0,
    });

    expect(result.status).toBe("AT_RISK");
    expect(result.score).toBe(40);
    expect(result.reasons).toContain("No completed bookings yet.");
  });

  it("reduces score for low lifetime value", () => {
    const result = calculateClientHealth({
      id: "3",
      name: "Small Client",
      email: "small@example.com",
      totalBookings: 2,
      totalRevenue: 100,
      lastBookingAt: new Date(),
      averageBookingValue: 50,
    });

    expect(result.score).toBe(80);
    expect(result.status).toBe("GOOD");
  });
});
