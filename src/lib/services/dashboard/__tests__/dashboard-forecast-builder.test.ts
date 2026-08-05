import { describe, expect, it } from "vitest";
import type { DashboardQueryResult } from "@/lib/queries/dashboard/get-dashboard-query";
import { buildDashboardForecasts } from "../dashboard-forecast-builder";
import { createDashboardQuery } from "./fixtures";

const DAY_OF_WEEK_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

function createBusinessHourForFirstDay({
  data,
  openTime = "09:00",
  closeTime = "17:00",
  closed = false,
}: {
  data: DashboardQueryResult;
  openTime?: string;
  closeTime?: string;
  closed?: boolean;
}): DashboardQueryResult["businessHours"] {
  const firstDate = data.nextSevenDays[0].date;

  return [
    {
      dayOfWeek: DAY_OF_WEEK_NAMES[firstDate.getDay()],
      openTime,
      closeTime,
      closed,
    },
  ] as DashboardQueryResult["businessHours"];
}

describe("buildDashboardForecasts", () => {
  it("builds dashboard forecasts from query data", () => {
    const data = createDashboardQuery();

    const result = buildDashboardForecasts({
      data,
    });

    expect(result.revenueCollected).toBe(18_000);
    expect(result.revenueOutstanding).toBe(3_000);
    expect(result.previousPeriodRevenue).toBe(15_000);

    expect(result.upcomingBookingRevenue).toBe(800);

    expect(result.averageServiceDuration).toBe(75);
    expect(result.averageServicePrice).toBe(250);

    // Eight business hours equals 480 minutes.
    // 480 / 75-minute average service duration = 6 slots.
    expect(result.workspaceCapacity.today).toMatchObject({
      label: data.nextSevenDays[0].label,
      capacity: 6,
      bookings: data.bookingTrendCounts[0],
      openSlots: 0,
      utilizationRate: 100,
    });

    expect(result.workspaceCapacity.tomorrow).toMatchObject({
      label: data.nextSevenDays[1].label,
      capacity: 6,
      bookings: data.bookingTrendCounts[1],
      openSlots: 2,
      utilizationRate: 67,
    });

    expect(result.workspaceCapacity.days).toHaveLength(7);

    expect(result.bookingForecast).toBeDefined();
    expect(result.revenueForecast).toBeDefined();
  });

  it("defaults service metrics when no active services exist", () => {
    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        activeServices: [],
      }),
    });

    expect(result.averageServiceDuration).toBe(60);
    expect(result.averageServicePrice).toBe(0);

    // 480 minutes / 60-minute default duration.
    expect(result.workspaceCapacity.today.capacity).toBe(8);

    expect(result.workspaceCapacity.estimatedOpenRevenue).toBe(0);
  });

  it("returns zero capacity for a closed business day", () => {
    const baseData = createDashboardQuery();

    const data = createDashboardQuery({
      nextSevenDays: baseData.nextSevenDays,
      businessHours: createBusinessHourForFirstDay({
        data: baseData,
        closed: true,
      }),
    });

    const result = buildDashboardForecasts({
      data,
    });

    expect(result.workspaceCapacity.today).toMatchObject({
      label: data.nextSevenDays[0].label,
      capacity: 0,
      openSlots: 0,
    });
  });

  it("returns zero capacity for invalid business hours", () => {
    const baseData = createDashboardQuery();

    const data = createDashboardQuery({
      nextSevenDays: baseData.nextSevenDays,
      businessHours: createBusinessHourForFirstDay({
        data: baseData,
        openTime: "invalid",
        closeTime: "99:99",
      }),
    });

    const result = buildDashboardForecasts({
      data,
    });

    expect(result.workspaceCapacity.today.capacity).toBe(0);
  });

  it("returns zero capacity when closing time precedes opening time", () => {
    const baseData = createDashboardQuery();

    const data = createDashboardQuery({
      nextSevenDays: baseData.nextSevenDays,
      businessHours: createBusinessHourForFirstDay({
        data: baseData,
        openTime: "17:00",
        closeTime: "09:00",
      }),
    });

    const result = buildDashboardForecasts({
      data,
    });

    expect(result.workspaceCapacity.today.capacity).toBe(0);
  });

  it("returns zero capacity when business hours are missing", () => {
    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        businessHours: [],
      }),
    });

    expect(result.workspaceCapacity.today.capacity).toBe(0);
    expect(result.workspaceCapacity.tomorrow.capacity).toBe(0);
    expect(result.workspaceCapacity.weeklyCapacity).toBe(0);
  });

  it("calculates upcoming booking revenue", () => {
    const upcomingBookingsForForecast = [
      {
        service: {
          price: 100,
        },
      },
      {
        service: {
          price: 250,
        },
      },
      {
        service: {
          price: 150,
        },
      },
    ] as DashboardQueryResult["upcomingBookingsForForecast"];

    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        upcomingBookingsForForecast,
      }),
    });

    expect(result.upcomingBookingRevenue).toBe(500);
  });

  it("returns zero upcoming revenue when no upcoming bookings exist", () => {
    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        upcomingBookingsForForecast: [],
      }),
    });

    expect(result.upcomingBookingRevenue).toBe(0);
  });

  it("uses booking trend counts as daily booking totals", () => {
    const bookingTrendCounts = [1, 2, 3, 4, 5, 6, 7];

    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        bookingTrendCounts,
      }),
    });

    expect(result.workspaceCapacity.days.map((day) => day.bookings)).toEqual(
      bookingTrendCounts,
    );
  });

  it("returns zero revenue values when aggregates are null", () => {
    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        totalRevenue: {
          _sum: {
            amount: null,
          },
        },

        outstandingRevenue: {
          _sum: {
            amount: null,
          },
        },

        previousPeriodRevenue: {
          _sum: {
            amount: null,
          },
        },
      }),
    });

    expect(result.revenueCollected).toBe(0);

    expect(result.revenueOutstanding).toBe(0);

    expect(result.previousPeriodRevenue).toBe(0);
  });

  it("passes workspace bookings into the booking forecast", () => {
    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        bookingTrendCounts: [6, 5, 4, 3, 2, 1, 0],
      }),
    });

    expect(result.bookingForecast.utilizationToday).toBeGreaterThan(0);

    expect(result.bookingForecast.utilizationWeek).toBeGreaterThan(0);
  });

  it("propagates booking cancellation risk", () => {
    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        cancellationsLastThirtyDays: 25,
        totalBookingsLastThirtyDays: 30,
      }),
    });

    expect(result.bookingForecast.risk).toBe("HIGH");
  });

  it("propagates constrained workspace capacity", () => {
    const result = buildDashboardForecasts({
      data: createDashboardQuery({
        bookingTrendCounts: [8, 8, 8, 8, 8, 8, 8],
      }),
    });

    expect(result.workspaceCapacity.constrained).toBe(true);
  });
});
