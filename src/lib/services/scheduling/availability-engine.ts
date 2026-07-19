import type {
  BookingAvailabilityRecord,
  BookingAvailabilityRepository,
} from "@/lib/repositories/booking-availability-repository";

import { convertTimeToMinutes } from "./time/time-utils";

export interface AvailabilityRequest {
  workspaceId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  excludeBookingId?: string;

  preBookingBufferMinutes?: number;
  postBookingBufferMinutes?: number;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  conflictingBookingId?: string;
}

export type AvailabilityChecker = (
  request: AvailabilityRequest,
) => Promise<AvailabilityResult>;

function isValidBuffer(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

function bookingsConflict(
  requestedStartMinutes: number,
  requestedEndMinutes: number,
  existingBooking: BookingAvailabilityRecord,
  preBookingBufferMinutes: number,
  postBookingBufferMinutes: number,
): boolean {
  const existingStartMinutes = convertTimeToMinutes(existingBooking.startTime);

  const existingEndMinutes = convertTimeToMinutes(existingBooking.endTime);

  if (
    existingStartMinutes === null ||
    existingEndMinutes === null ||
    existingEndMinutes <= existingStartMinutes
  ) {
    /*
     * Invalid persisted booking times are treated as conflicts.
     *
     * Silently ignoring corrupt booking data could allow a double booking.
     */
    return true;
  }

  const bufferedRequestedStart =
    requestedStartMinutes - preBookingBufferMinutes;

  const bufferedRequestedEnd = requestedEndMinutes + postBookingBufferMinutes;

  const bufferedExistingStart = existingStartMinutes - preBookingBufferMinutes;

  const bufferedExistingEnd = existingEndMinutes + postBookingBufferMinutes;

  return (
    bufferedExistingStart < bufferedRequestedEnd &&
    bufferedExistingEnd > bufferedRequestedStart
  );
}

export function createAvailabilityChecker(
  repository: BookingAvailabilityRepository,
): AvailabilityChecker {
  return async function checkAvailabilityWithRepository(
    request: AvailabilityRequest,
  ): Promise<AvailabilityResult> {
    const startMinutes = convertTimeToMinutes(request.startTime);
    const endMinutes = convertTimeToMinutes(request.endTime);

    if (startMinutes === null || endMinutes === null) {
      return {
        available: false,
        reason: "The requested booking time is invalid.",
      };
    }

    if (endMinutes <= startMinutes) {
      return {
        available: false,
        reason: "The booking end time must be after the start time.",
      };
    }

    const preBookingBufferMinutes = request.preBookingBufferMinutes ?? 0;

    const postBookingBufferMinutes = request.postBookingBufferMinutes ?? 0;

    if (
      !isValidBuffer(preBookingBufferMinutes) ||
      !isValidBuffer(postBookingBufferMinutes)
    ) {
      return {
        available: false,
        reason: "The booking buffer configuration is invalid.",
      };
    }

    const existingBookings = await repository.findActiveBookingsForDate({
      workspaceId: request.workspaceId,
      bookingDate: request.bookingDate,
      excludeBookingId: request.excludeBookingId,
    });

    const conflictingBooking = existingBookings.find((booking) =>
      bookingsConflict(
        startMinutes,
        endMinutes,
        booking,
        preBookingBufferMinutes,
        postBookingBufferMinutes,
      ),
    );

    if (conflictingBooking) {
      return {
        available: false,
        reason:
          preBookingBufferMinutes > 0 || postBookingBufferMinutes > 0
            ? "The requested time conflicts with an existing booking or its required buffer time."
            : "The requested time overlaps an existing booking.",
        conflictingBookingId: conflictingBooking.id,
      };
    }

    return {
      available: true,
    };
  };
}

