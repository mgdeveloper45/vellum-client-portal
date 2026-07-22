export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface UpdateBookingStatusRequest {
  bookingId: string;
  workspaceId: string;
  status: BookingStatus;
}
