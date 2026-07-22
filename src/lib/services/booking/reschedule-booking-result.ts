export enum RescheduleBookingErrorCode {
  BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND",
  RESCHEDULE_NOT_ALLOWED = "RESCHEDULE_NOT_ALLOWED",
  BOOKING_UPDATE_FAILED = "BOOKING_UPDATE_FAILED",
}

export interface RescheduleBookingResult {
  success: boolean;
  bookingId?: string;
  reasons?: string[];
  code?: RescheduleBookingErrorCode;
}
