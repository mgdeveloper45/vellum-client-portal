import type { BookingRule } from "./booking-rules";
import type { SchedulingConfiguration } from "./scheduling-configuration";

export interface SchedulingContext {
  workspaceId: string;
  serviceId: string;
  servicePrice: number;
  
  configuration: SchedulingConfiguration;

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
