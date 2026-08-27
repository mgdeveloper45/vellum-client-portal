export type BookingWorkflowRecord = {
  id: string;
  customerName: string;
  customerEmail: string;
  notes: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  googleCalendarEventId: string | null;
  serviceId: string;
  service: {
    name: string;
  };
  workspace: {
    name: string;
    companyName: string | null;
    slug: string | null;
  };
};

export type CreateBookingNotificationInput = {
  userId: string;
  title: string;
  message: string;
  href: string;
};

export interface BookingWorkflowRepository {
  findBookingForWorkflow(input: {
    bookingId: string;
    workspaceId: string;
  }): Promise<BookingWorkflowRecord | null>;

  updateGoogleCalendarEventId(input: {
    bookingId: string;
    googleCalendarEventId: string;
  }): Promise<void>;

  createWorkspaceAdminNotification(input: {
    workspaceId: string;
    title: string;
    message: string;
    href: string;
  }): Promise<boolean>;

  createUserNotification(input: CreateBookingNotificationInput): Promise<void>;
}
