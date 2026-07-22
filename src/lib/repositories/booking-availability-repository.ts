export interface BookingAvailabilityRecord {
  id: string;
  startTime: string;
  endTime: string;
}

export interface FindBookingAvailabilityInput {
  workspaceId: string;
  bookingDate: Date;
  serviceId?: string;
  excludeBookingId?: string;
}

export interface BookingAvailabilityRepository {
  findActiveBookingsForDate(
    input: FindBookingAvailabilityInput,
  ): Promise<BookingAvailabilityRecord[]>;
}
