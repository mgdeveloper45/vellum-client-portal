import { describe, expect, it } from "vitest";

import { createAvailabilityChecker } from "../availability-engine";
import {
  InMemoryBookingAvailabilityRepository,
  type InMemoryBookingAvailabilityRecord,
} from "../test-utils/repositories/in-memory-booking-availability-repository";


const bookingDate = new Date("2026-08-17T10:00:00");

function createExistingBooking(
  overrides: Partial<InMemoryBookingAvailabilityRecord> = {},
): InMemoryBookingAvailabilityRecord {
  return {
    id: "booking-1",
    workspaceId: "workspace-1",
    bookingDate,
    status: "CONFIRMED",
    startTime: "09:00",
    endTime: "10:00",
    ...overrides,
  };
}

describe("checkAvailability", () => {
  it("allows a booking when no existing bookings conflict", async () => {
    const repository = new InMemoryBookingAvailabilityRepository();

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "10:00",
      endTime: "11:00",
    });

    expect(result).toEqual({
      available: true,
    });
  });

  it("rejects a booking that directly overlaps an existing booking", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking(),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "09:30",
      endTime: "10:30",
    });

    expect(result.available).toBe(false);
    expect(result.reason).toBe(
      "The requested time overlaps an existing booking.",
    );
    expect(result.conflictingBookingId).toBe("booking-1");
  });

  it("allows directly adjacent bookings when no buffers are configured", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking(),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "10:00",
      endTime: "11:00",
    });

    expect(result.available).toBe(true);
  });

  it("rejects a booking that violates the pre-booking buffer", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking(),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "10:10",
      endTime: "11:00",
      preBookingBufferMinutes: 15,
      postBookingBufferMinutes: 0,
    });

    expect(result.available).toBe(false);
    expect(result.reason).toBe(
      "The requested time conflicts with an existing booking or its required buffer time.",
    );
  });

  it("allows a booking exactly at the pre-booking buffer boundary", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking(),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "10:15",
      endTime: "11:00",
      preBookingBufferMinutes: 15,
      postBookingBufferMinutes: 0,
    });

    expect(result.available).toBe(true);
  });

  it("rejects a booking that violates the post-booking buffer", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking({
        startTime: "10:10",
        endTime: "11:00",
      }),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "09:00",
      endTime: "10:00",
      preBookingBufferMinutes: 0,
      postBookingBufferMinutes: 15,
    });

    expect(result.available).toBe(false);
  });

  it("allows a booking exactly at the post-booking buffer boundary", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking({
        startTime: "10:15",
        endTime: "11:00",
      }),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "09:00",
      endTime: "10:00",
      preBookingBufferMinutes: 0,
      postBookingBufferMinutes: 15,
    });

    expect(result.available).toBe(true);
  });

  it("ignores cancelled bookings", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking({
        status: "CANCELLED",
      }),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "09:30",
      endTime: "10:30",
    });

    expect(result.available).toBe(true);
  });

  it("excludes the booking being rescheduled", async () => {
    const repository = new InMemoryBookingAvailabilityRepository([
      createExistingBooking(),
    ]);

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "09:00",
      endTime: "10:00",
      excludeBookingId: "booking-1",
    });

    expect(result.available).toBe(true);
  });

  it("rejects invalid requested booking times", async () => {
    const repository = new InMemoryBookingAvailabilityRepository();

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "invalid",
      endTime: "10:00",
    });

    expect(result).toEqual({
      available: false,
      reason: "The requested booking time is invalid.",
    });
  });

  it("rejects invalid negative buffer configuration", async () => {
    const repository = new InMemoryBookingAvailabilityRepository();

    const checkAvailability = createAvailabilityChecker(repository);

    const result = await checkAvailability({
      workspaceId: "workspace-1",
      bookingDate,
      startTime: "10:00",
      endTime: "11:00",
      preBookingBufferMinutes: -15,
    });

    expect(result).toEqual({
      available: false,
      reason: "The booking buffer configuration is invalid.",
    });
  });
});
