import type { BookingStatus } from "./update-booking-status-request";

export enum UpdateBookingStatusErrorCode {
  BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND",
  BOOKING_UPDATE_FAILED = "BOOKING_UPDATE_FAILED",
}

export interface UpdateBookingStatusSuccess {
  success: true;
  bookingId: string;
  status: BookingStatus;
  previousGoogleCalendarEventId: string | null;
}

export interface UpdateBookingStatusFailure {
  success: false;
  code: UpdateBookingStatusErrorCode;
  reasons: string[];
}

export type UpdateBookingStatusResult =
  UpdateBookingStatusSuccess | UpdateBookingStatusFailure;
