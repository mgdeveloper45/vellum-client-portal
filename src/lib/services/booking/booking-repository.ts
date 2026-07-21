export interface BookableService {
  id: string;
  workspaceId: string;
  name: string;
  duration: number;
  price: number;
}
export interface CreateBookingRecordInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  serviceId: string;
  workspaceId: string;
}
export interface CreatedBookingRecord {
  id: string;
}
export interface BookingRepository {
  findActiveService(
    serviceId: string,
    workspaceId: string,
  ): Promise<BookableService | null>;
  create(input: CreateBookingRecordInput): Promise<CreatedBookingRecord>;
}
