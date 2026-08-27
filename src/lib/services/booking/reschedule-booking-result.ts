export enum RescheduleBookingErrorCode {
  BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND",
  RESCHEDULE_NOT_ALLOWED = "RESCHEDULE_NOT_ALLOWED",
  BOOKING_UPDATE_FAILED = "BOOKING_UPDATE_FAILED",
}

export interface FreedBookingSlot {
  serviceId: string;
  date: Date;
  startTime: string;
}

export interface RescheduleBookingResult {
  success: boolean;
  bookingId?: string;
  freedSlot?: FreedBookingSlot;
  reasons?: string[];
  code?: RescheduleBookingErrorCode;
}
