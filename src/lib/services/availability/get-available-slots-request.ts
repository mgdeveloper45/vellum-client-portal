export interface GetAvailableSlotsRequest {
  workspaceId: string;
  serviceId: string;
  bookingDate: Date;
  duration: number;
  excludeBookingId?: string;
}
