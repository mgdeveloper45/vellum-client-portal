export interface BookingRequest {
  workspaceId: string;
  serviceId: string;

  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  notes?: string;

  date: string;
  startTime: string;
}
