import { describe, expect, it } from "vitest";
import {
  calculateAverageBookingValue,
  calculateLifetimeValue,
} from "../client-lifetime-value";

const client = {
  id: "1",
  name: "Marcus",
  email: "marcus@example.com",

  totalBookings: 4,
  totalRevenue: 1200,

  lastBookingAt: new Date(),

  averageBookingValue: 300,
};

describe("client lifetime value", () => {
  it("calculates total revenue", () => {
    expect(calculateLifetimeValue(client)).toBe(1200);
  });

  it("calculates average booking value", () => {
    expect(calculateAverageBookingValue(client)).toBe(300);
  });

  it("returns zero average when there are no bookings", () => {
    expect(
      calculateAverageBookingValue({
        id: "2",
        name: "New Client",
        email: "new@example.com",
        totalBookings: 0,
        totalRevenue: 0,
        lastBookingAt: null,
        averageBookingValue: 0,
      }),
    ).toBe(0);
  });
});
