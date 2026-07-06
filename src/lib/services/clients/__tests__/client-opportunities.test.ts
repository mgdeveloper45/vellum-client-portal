import { describe, expect, it } from "vitest";
import { calculateClientOpportunities } from "../client-opportunities";

describe("calculateClientOpportunities", () => {
  it("creates opportunities for a loyal client", () => {
    const opportunities = calculateClientOpportunities({
      id: "1",
      name: "Loyal Client",
      email: "loyal@example.com",
      totalBookings: 8,
      totalRevenue: 2500,
      lastBookingAt: new Date(),
      averageBookingValue: 312,
    });

    expect(opportunities.some((o) => o.type === "REFERRAL")).toBe(true);
    expect(opportunities.some((o) => o.type === "UPSELL")).toBe(true);
    expect(opportunities.some((o) => o.type === "REVIEW")).toBe(true);
  });

  it("creates a rebooking opportunity for inactive clients", () => {
    const opportunities = calculateClientOpportunities({
      id: "2",
      name: "Inactive",
      email: "inactive@example.com",
      totalBookings: 4,
      totalRevenue: 800,
      lastBookingAt: new Date("2025-01-01"),
      averageBookingValue: 200,
    });

    expect(opportunities.some((o) => o.type === "REBOOK")).toBe(true);
  });

  it("returns no opportunities for a brand-new client", () => {
    const opportunities = calculateClientOpportunities({
      id: "3",
      name: "New",
      email: "new@example.com",
      totalBookings: 0,
      totalRevenue: 0,
      lastBookingAt: null,
      averageBookingValue: 0,
    });

    expect(opportunities).toHaveLength(1);
    expect(opportunities[0].type).toBe("REBOOK");
  });
});
