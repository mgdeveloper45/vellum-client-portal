import { describe, expect, it } from "vitest";

import {
  buildWorkspaceCapacity,
  type WorkspaceCapacityInput,
} from "../workspace-capacity-engine";

function createInput(
  overrides: Partial<WorkspaceCapacityInput> = {},
): WorkspaceCapacityInput {
  return {
    todayLabel: "Monday",
    tomorrowLabel: "Tuesday",

    days: [
      {
        label: "Monday",
        capacity: 8,
        bookings: 6,
        averageBookingValue: 200,
      },
      {
        label: "Tuesday",
        capacity: 8,
        bookings: 4,
        averageBookingValue: 200,
      },
      {
        label: "Wednesday",
        capacity: 8,
        bookings: 7,
        averageBookingValue: 200,
      },
      {
        label: "Thursday",
        capacity: 8,
        bookings: 2,
        averageBookingValue: 200,
      },
      {
        label: "Friday",
        capacity: 8,
        bookings: 8,
        averageBookingValue: 200,
      },
    ],

    ...overrides,
  };
}

describe("buildWorkspaceCapacity", () => {
  it("calculates daily and weekly capacity", () => {
    const capacity = buildWorkspaceCapacity(createInput());

    expect(capacity.today.utilizationRate).toBe(75);

    expect(capacity.tomorrow.utilizationRate).toBe(50);

    expect(capacity.weeklyCapacity).toBe(40);

    expect(capacity.weeklyBookings).toBe(27);

    expect(capacity.weeklyOpenSlots).toBe(13);
  });

  it("calculates estimated open revenue", () => {
    const capacity = buildWorkspaceCapacity(createInput());

    expect(capacity.estimatedOpenRevenue).toBe(2600);
  });

  it("identifies the lowest utilization day", () => {
    const capacity = buildWorkspaceCapacity(createInput());

    expect(capacity.lowestUtilizationDay?.label).toBe("Thursday");

    expect(capacity.lowestUtilizationDay?.openSlots).toBe(6);

    expect(capacity.recommendation).toContain("Thursday");
  });

  it("identifies the highest utilization day", () => {
    const capacity = buildWorkspaceCapacity(createInput());

    expect(capacity.highestUtilizationDay?.label).toBe("Friday");

    expect(capacity.highestUtilizationDay?.utilizationRate).toBe(100);
  });

  it("marks a nearly full workspace as constrained", () => {
    const capacity = buildWorkspaceCapacity(
      createInput({
        days: [
          {
            label: "Monday",
            capacity: 8,
            bookings: 8,
          },
          {
            label: "Tuesday",
            capacity: 8,
            bookings: 7,
          },
          {
            label: "Wednesday",
            capacity: 8,
            bookings: 8,
          },
          {
            label: "Thursday",
            capacity: 8,
            bookings: 7,
          },
          {
            label: "Friday",
            capacity: 8,
            bookings: 8,
          },
        ],
      }),
    );

    expect(capacity.constrained).toBe(true);

    expect(capacity.summary).toContain("full capacity");
  });

  it("returns high risk for low utilization", () => {
    const capacity = buildWorkspaceCapacity(
      createInput({
        days: [
          {
            label: "Monday",
            capacity: 8,
            bookings: 1,
          },
          {
            label: "Tuesday",
            capacity: 8,
            bookings: 1,
          },
          {
            label: "Wednesday",
            capacity: 8,
            bookings: 1,
          },
          {
            label: "Thursday",
            capacity: 8,
            bookings: 1,
          },
          {
            label: "Friday",
            capacity: 8,
            bookings: 1,
          },
        ],
      }),
    );

    expect(capacity.risk).toBe("HIGH");

    expect(capacity.weeklyUtilizationRate).toBe(13);
  });

  it("handles missing today and tomorrow safely", () => {
    const capacity = buildWorkspaceCapacity({
      todayLabel: "Saturday",
      tomorrowLabel: "Sunday",
      days: [],
    });

    expect(capacity.today.capacity).toBe(0);
    expect(capacity.tomorrow.capacity).toBe(0);
    expect(capacity.weeklyCapacity).toBe(0);
    expect(capacity.weeklyUtilizationRate).toBe(0);
  });

  it("never produces negative open capacity", () => {
    const capacity = buildWorkspaceCapacity({
      todayLabel: "Monday",
      tomorrowLabel: "Tuesday",
      days: [
        {
          label: "Monday",
          capacity: 5,
          bookings: 8,
          averageBookingValue: 100,
        },
      ],
    });

    expect(capacity.today.openSlots).toBe(0);

    expect(capacity.today.utilizationRate).toBe(100);
  });
});
