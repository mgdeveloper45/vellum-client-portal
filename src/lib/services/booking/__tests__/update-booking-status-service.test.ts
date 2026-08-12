import { describe, expect, it, vi } from "vitest";
import type { BookingRepository } from "../booking-repository";
import { createUpdateBookingStatusService } from "../update-booking-status-service";
import { UpdateBookingStatusErrorCode } from "../update-booking-status-result";

function createBookingRepository(overrides?: {
  booking?: {
    id: string;
    googleCalendarEventId: string | null;
  } | null;
  updateError?: Error;
}): BookingRepository {
  return {
    create: vi.fn().mockResolvedValue({
      id: "booking-1",
    }),

    findForReschedule: vi.fn().mockResolvedValue(null),

    reschedule: vi.fn().mockResolvedValue({
      id: "booking-1",
    }),

    findForStatusUpdate: vi.fn().mockResolvedValue(
      overrides?.booking === undefined
        ? {
            id: "booking-1",
            googleCalendarEventId: "calendar-event-1",
          }
        : overrides.booking,
    ),

    updateStatus: overrides?.updateError
      ? vi.fn().mockRejectedValue(overrides.updateError)
      : vi.fn().mockResolvedValue({
          id: "booking-1",
        }),

    findForProjectCreation: vi.fn().mockResolvedValue(null),
    linkToProject: vi.fn().mockResolvedValue(false),
  };
}

describe("updateBookingStatusService", () => {
  it("updates a booking status and preserves its calendar event", async () => {
    const bookingRepository = createBookingRepository();

    const service = createUpdateBookingStatusService({
      bookingRepository,
    });

    const result = await service.execute({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      status: "COMPLETED",
    });

    expect(result).toEqual({
      success: true,
      bookingId: "booking-1",
      status: "COMPLETED",
      previousGoogleCalendarEventId: "calendar-event-1",
    });

    expect(bookingRepository.findForStatusUpdate).toHaveBeenCalledWith(
      "booking-1",
      "workspace-1",
    );

    expect(bookingRepository.updateStatus).toHaveBeenCalledWith({
      bookingId: "booking-1",
      status: "COMPLETED",
      googleCalendarEventId: "calendar-event-1",
    });
  });

  it("clears the calendar event identifier when cancelling", async () => {
    const bookingRepository = createBookingRepository();

    const service = createUpdateBookingStatusService({
      bookingRepository,
    });

    const result = await service.execute({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      status: "CANCELLED",
    });

    expect(result).toEqual({
      success: true,
      bookingId: "booking-1",
      status: "CANCELLED",
      previousGoogleCalendarEventId: "calendar-event-1",
    });

    expect(bookingRepository.updateStatus).toHaveBeenCalledWith({
      bookingId: "booking-1",
      status: "CANCELLED",
      googleCalendarEventId: null,
    });
  });

  it("returns BOOKING_NOT_FOUND when the booking is unavailable", async () => {
    const bookingRepository = createBookingRepository({
      booking: null,
    });

    const service = createUpdateBookingStatusService({
      bookingRepository,
    });

    const result = await service.execute({
      bookingId: "missing-booking",
      workspaceId: "workspace-1",
      status: "CONFIRMED",
    });

    expect(result).toEqual({
      success: false,
      code: UpdateBookingStatusErrorCode.BOOKING_NOT_FOUND,
      reasons: ["The booking could not be found."],
    });

    expect(bookingRepository.updateStatus).not.toHaveBeenCalled();
  });

  it("returns BOOKING_UPDATE_FAILED when persistence fails", async () => {
    const bookingRepository = createBookingRepository({
      updateError: new Error("database unavailable"),
    });

    const service = createUpdateBookingStatusService({
      bookingRepository,
    });

    const result = await service.execute({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      status: "CONFIRMED",
    });

    expect(result).toEqual({
      success: false,
      code: UpdateBookingStatusErrorCode.BOOKING_UPDATE_FAILED,
      reasons: ["The booking status could not be updated. Please try again."],
    });
  });

  it("supports bookings without a calendar event", async () => {
    const bookingRepository = createBookingRepository({
      booking: {
        id: "booking-1",
        googleCalendarEventId: null,
      },
    });

    const service = createUpdateBookingStatusService({
      bookingRepository,
    });

    const result = await service.execute({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
      status: "CANCELLED",
    });

    expect(result).toEqual({
      success: true,
      bookingId: "booking-1",
      status: "CANCELLED",
      previousGoogleCalendarEventId: null,
    });

    expect(bookingRepository.updateStatus).toHaveBeenCalledWith({
      bookingId: "booking-1",
      status: "CANCELLED",
      googleCalendarEventId: null,
    });
  });
});
