import { describe, expect, it } from "vitest";

import {
  buildRevenueForecast,
  type RevenueForecastInput,
} from "../revenue-forecast-engine";

function createInput(
  overrides: Partial<RevenueForecastInput> = {},
): RevenueForecastInput {
  return {
    revenueCollected: 10000,
    outstandingRevenue: 4000,
    overdueRevenue: 1000,
    paidInvoices: 8,
    totalInvoices: 10,
    upcomingBookingRevenue: 3000,
    previousPeriodRevenue: 14000,
    ...overrides,
  };
}

describe("buildRevenueForecast", () => {
  it("builds a complete revenue forecast", () => {
    const forecast = buildRevenueForecast(createInput());

    expect(forecast.projectedRevenue).toBeGreaterThan(10000);

    expect(forecast.expectedCollections).toBeGreaterThan(0);

    expect(forecast.confidence).toBeGreaterThanOrEqual(55);

    expect(forecast.summary).toBeTruthy();
  });

  it("identifies upward revenue movement", () => {
    const forecast = buildRevenueForecast(
      createInput({
        previousPeriodRevenue: 9000,
      }),
    );

    expect(forecast.trend).toBe("UP");
  });

  it("identifies high collection risk", () => {
    const forecast = buildRevenueForecast(
      createInput({
        outstandingRevenue: 10000,
        overdueRevenue: 8000,
        paidInvoices: 2,
        totalInvoices: 10,
      }),
    );

    expect(forecast.risk).toBe("HIGH");

    expect(forecast.revenueAtRisk).toBeGreaterThan(0);
  });

  it("returns low risk when collections are healthy", () => {
    const forecast = buildRevenueForecast(
      createInput({
        outstandingRevenue: 0,
        overdueRevenue: 0,
        paidInvoices: 10,
        totalInvoices: 10,
      }),
    );

    expect(forecast.risk).toBe("LOW");
  });

  it("never returns confidence above 95", () => {
    const forecast = buildRevenueForecast(
      createInput({
        paidInvoices: 100,
        totalInvoices: 100,
        upcomingBookingRevenue: 50000,
      }),
    );

    expect(forecast.confidence).toBeLessThanOrEqual(95);
  });
});
