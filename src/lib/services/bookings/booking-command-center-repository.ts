export type BookingCommandCenterInvoice = {
  id: string;
  paid: boolean;
};

export type BookingCommandCenterDepositPayment = {
  amount: number;
};

export type BookingCommandCenterDeposit = {
  amount: number;
  status: "REQUESTED" | "PARTIALLY_PAID" | "PAID" | "REFUNDED" | "CANCELLED";
  payments: BookingCommandCenterDepositPayment[];
};

export type BookingCommandCenterProject = {
  id: string;
  invoices: BookingCommandCenterInvoice[];
  messages: unknown[];
  files: unknown[];
  deposits: BookingCommandCenterDeposit[];
};

export type BookingCommandCenterBooking = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;

  depositRequired: boolean;
  depositAmount: number;

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

  project: BookingCommandCenterProject | null;
};

export interface BookingCommandCenterRepository {
  findBooking(input: {
    bookingId: string;
    workspaceId: string;
  }): Promise<BookingCommandCenterBooking | null>;
}
