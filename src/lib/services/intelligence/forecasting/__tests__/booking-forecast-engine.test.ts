import { describe, expect, it } from "vitest";

import {
  buildBookingForecast,
  type BookingForecastInput,
} from "../booking-forecast-engine";

function createInput(
  overrides: Partial<BookingForecastInput> = {},
): BookingForecastInput {
  return {
    todaysBookings: 6,
    todayCapacity: 8,

    tomorrowsBookings: 4,
    tomorrowCapacity: 8,

    nextSevenDays: [
      {
        label: "Monday",
        bookings: 6,
        capacity: 8,
      },
      {
        label: "Tuesday",
        bookings: 4,
        capacity: 8,
      },
      {
        label: "Wednesday",
        bookings: 7,
        capacity: 8,
      },
      {
        label: "Thursday",
        bookings: 2,
        capacity: 8,
      },
      {
        label: "Friday",
        bookings: 8,
        capacity: 8,
      },
    ],

    previousSevenDaysBookings: 24,

    cancellationsLastThirtyDays: 2,
    totalBookingsLastThirtyDays: 30,

    ...overrides,
  };
}

describe("buildBookingForecast", () => {
  it("builds booking utilization metrics", () => {
    const forecast = buildBookingForecast(createInput());

    expect(forecast.utilizationToday).toBe(75);

    expect(forecast.utilizationTomorrow).toBe(50);

    expect(forecast.utilizationWeek).toBeGreaterThan(0);

    expect(forecast.availableCapacityWeek).toBeGreaterThan(0);
  });

  it("identifies the peak booking day", () => {
    const forecast = buildBookingForecast(createInput());

    expect(forecast.peakDayLabel).toBe("Friday");

    expect(forecast.peakDayUtilization).toBe(100);
  });

  it("recommends the day with the most open capacity", () => {
    const forecast = buildBookingForecast(createInput());

    expect(forecast.recommendation).toContain("Thursday");

    expect(forecast.recommendation).toContain("6");
  });

  it("identifies high cancellation risk", () => {
    const forecast = buildBookingForecast(
      createInput({
        cancellationsLastThirtyDays: 10,
        totalBookingsLastThirtyDays: 30,
      }),
    );

    expect(forecast.risk).toBe("HIGH");

    expect(forecast.recommendation).toContain("cancellations");
  });

  it("identifies increasing booking demand", () => {
    const forecast = buildBookingForecast(
      createInput({
        previousSevenDaysBookings: 15,
      }),
    );

    expect(forecast.trend).toBe("UP");
  });

  it("never returns confidence above 95", () => {
    const forecast = buildBookingForecast(
      createInput({
        totalBookingsLastThirtyDays: 100,
      }),
    );

    expect(forecast.confidence).toBeLessThanOrEqual(95);
  });

  it("handles zero capacity safely", () => {
    const forecast = buildBookingForecast(
      createInput({
        todaysBookings: 0,
        todayCapacity: 0,
        tomorrowsBookings: 0,
        tomorrowCapacity: 0,
        nextSevenDays: [],
      }),
    );

    expect(forecast.utilizationToday).toBe(0);

    expect(forecast.utilizationTomorrow).toBe(0);

    expect(forecast.utilizationWeek).toBe(0);
  });
});
