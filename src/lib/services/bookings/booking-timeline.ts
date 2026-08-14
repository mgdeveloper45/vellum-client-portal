export type BookingTimelineEvent = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  occurredAt?: Date;
};

type BuildBookingTimelineParams = {
  bookingCreatedAt: Date;
  hasProject: boolean;
  hasInvoice: boolean;
  invoicePaid: boolean;
  hasMessages: boolean;
  hasFiles: boolean;
  depositRequired: boolean;
  hasDeposit: boolean;
  depositPaid: boolean;
  depositOutstanding: number;
};

export function buildBookingTimeline({
  bookingCreatedAt,
  hasProject,
  hasInvoice,
  invoicePaid,
  hasMessages,
  hasFiles,
  depositRequired,
  hasDeposit,
  depositPaid,
  depositOutstanding,
}: BuildBookingTimelineParams): BookingTimelineEvent[] {
  const events: BookingTimelineEvent[] = [];

  events.push({
    id: "booking-created",
    title: "Booking Created",
    description: "Customer completed the online booking.",
    completed: true,
    occurredAt: bookingCreatedAt,
  });

  events.push({
    id: "project-created",
    title: "Project Created",
    description: hasProject
      ? "A project has been created for this booking."
      : "Project has not been created yet.",
    completed: hasProject,
  });

  if (depositRequired) {
    let description = "Required deposit has not been requested.";
    let completed = false;

    if (hasDeposit && depositPaid) {
      description = "Required deposit has been paid.";
      completed = true;
    } else if (hasDeposit && depositOutstanding > 0) {
      description = `Required deposit has $${depositOutstanding.toLocaleString()} outstanding.`;
    }

    events.push({
      id: "deposit",
      title: "Deposit",
      description,
      completed,
    });
  }

  events.push({
    id: "client-communication",
    title: "Client Communication",
    description: hasMessages
      ? "Messages have been exchanged."
      : "No client messages yet.",
    completed: hasMessages,
  });

  events.push({
    id: "files",
    title: "Files",
    description: hasFiles
      ? "Client uploaded project files."
      : "Waiting for client uploads.",
    completed: hasFiles,
  });

  events.push({
    id: "invoice",
    title: "Invoice",
    description: hasInvoice
      ? "Invoice generated."
      : "Invoice has not been created.",
    completed: hasInvoice,
  });

  events.push({
    id: "payment",
    title: "Payment",
    description: invoicePaid ? "Invoice paid." : "Awaiting payment.",
    completed: invoicePaid,
  });

  return events;
}
