export enum BookingErrorCode {
  SERVICE_NOT_FOUND = "SERVICE_NOT_FOUND",
  BOOKING_NOT_ALLOWED = "BOOKING_NOT_ALLOWED",
  DEPOSIT_CALCULATION_FAILED = "DEPOSIT_CALCULATION_FAILED",
  BOOKING_CREATE_FAILED = "BOOKING_CREATE_FAILED",
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  code?: BookingErrorCode;
  reasons?: string[];
}
