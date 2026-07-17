import { BookingRule } from "./booking-rules";

export interface SchedulingContext {
  workspaceId: string;

  serviceId: string;

  servicePrice: number;

  bookingDate: Date;

  isNewClient: boolean;

  isVip: boolean;

  existingBookingsToday: number;

  bookingRules: BookingRule[];

  staffId?: string;

  resourceIds?: string[];

  clientId?: string;
}
