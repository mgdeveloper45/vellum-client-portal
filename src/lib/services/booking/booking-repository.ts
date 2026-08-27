import type { BookingStatus } from "./update-booking-status-request";

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

  depositRequired: boolean;
  depositAmount: number;
}

export interface CreatedBookingRecord {
  id: string;
}

export interface ReschedulableBooking {
  id: string;
  workspaceId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  service: {
    duration: number;
    price: number;
  };
}

export interface RescheduleBookingRecordInput {
  bookingId: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export interface RescheduledBookingRecord {
  id: string;
}

export interface BookingForProjectCreation {
  id: string;
  workspaceId: string;
  customerName: string;
  customerEmail: string;
  projectId: string | null;
  service: {
    name: string;
  };
}

export interface LinkBookingToProjectInput {
  bookingId: string;
  workspaceId: string;
  projectId: string;
}

export interface BookingRepository {
  create(input: CreateBookingRecordInput): Promise<CreatedBookingRecord>;

  findForProjectCreation(
    bookingId: string,
    workspaceId: string,
  ): Promise<BookingForProjectCreation | null>;

  linkToProject(input: LinkBookingToProjectInput): Promise<boolean>;

  findForReschedule(
    bookingId: string,
    workspaceId: string,
  ): Promise<ReschedulableBooking | null>;

  reschedule(
    input: RescheduleBookingRecordInput,
  ): Promise<RescheduledBookingRecord>;

  findForStatusUpdate(
    bookingId: string,
    workspaceId: string,
  ): Promise<BookingForStatusUpdate | null>;

  updateStatus(
    input: UpdateBookingStatusRecordInput,
  ): Promise<UpdatedBookingStatusRecord>;
}

export interface BookingForStatusUpdate {
  id: string;
  googleCalendarEventId: string | null;
}

export interface UpdateBookingStatusRecordInput {
  bookingId: string;
  status: BookingStatus;
  googleCalendarEventId: string | null;
}

export interface UpdatedBookingStatusRecord {
  id: string;
}
