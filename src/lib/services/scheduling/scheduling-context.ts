import type { BookingRule } from "./booking-rules";

export interface SchedulingContext {
  workspaceId: string;
  serviceId: string;
  servicePrice: number;

  bookingDate: Date;
  bookingStartTime: string;
  bookingEndTime: string;

  isNewClient: boolean;
  isVip: boolean;
  existingBookingsToday: number;

  bookingRules: BookingRule[];

  staffId?: string;
  resourceIds?: string[];
  clientId?: string;
  excludeBookingId?: string;
}
