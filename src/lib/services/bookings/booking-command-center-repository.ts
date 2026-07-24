export type BookingCommandCenterBooking = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  date: Date;
  startTime: string;
  endTime: string;
  googleCalendarEventId: string | null;
  service: {
    name: string;
  };
  workspace: {
    name: string;
    companyName: string | null;
  };
};

export type BookingCommandCenterProject = {
  invoices: {
    paid: boolean;
  }[];
  messages: unknown[];
  files: unknown[];
};

export interface BookingCommandCenterRepository {
  findBooking(input: {
    bookingId: string;
    workspaceId: string;
  }): Promise<BookingCommandCenterBooking | null>;

  findRelatedProjects(input: {
    workspaceId: string;
    customerEmail: string;
  }): Promise<BookingCommandCenterProject[]>;
}
