import { describe, expect, it } from "vitest";
import { calculateClientRetention } from "../client-retention";

describe("calculateClientRetention", () => {
  const today = new Date("2026-07-05");

  it("marks recent clients as LOW risk", () => {
    const result = calculateClientRetention(
      {
        id: "1",
        name: "Recent Client",
        email: "recent@example.com",
        totalBookings: 5,
        totalRevenue: 1000,
        lastBookingAt: new Date("2026-06-20"),
        averageBookingValue: 200,
      },
      today,
    );

    expect(result.risk).toBe("LOW");
    expect(result.daysSinceLastBooking).toBe(15);
  });

  it("marks inactive clients as MEDIUM risk", () => {
    const result = calculateClientRetention(
      {
        id: "2",
        name: "Inactive Client",
        email: "inactive@example.com",
        totalBookings: 3,
        totalRevenue: 500,
        lastBookingAt: new Date("2026-04-15"),
        averageBookingValue: 167,
      },
      today,
    );

    expect(result.risk).toBe("MEDIUM");
  });

  it("marks long inactive clients as HIGH risk", () => {
    const result = calculateClientRetention(
      {
        id: "3",
        name: "Lost Client",
        email: "lost@example.com",
        totalBookings: 10,
        totalRevenue: 3000,
        lastBookingAt: new Date("2025-12-01"),
        averageBookingValue: 300,
      },
      today,
    );

    expect(result.risk).toBe("HIGH");
  });

  it("handles clients with no bookings", () => {
    const result = calculateClientRetention(
      {
        id: "4",
        name: "Prospect",
        email: "prospect@example.com",
        totalBookings: 0,
        totalRevenue: 0,
        lastBookingAt: null,
        averageBookingValue: 0,
      },
      today,
    );

    expect(result.risk).toBe("HIGH");
    expect(result.daysSinceLastBooking).toBeNull();
  });
});
