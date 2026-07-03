export type BookingLifecycle =
  | "BOOKED"
  | "PREPARING"
  | "READY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FOLLOW_UP"
  | "PAID";

type BookingLifecycleInput = {
  status: string;
  hasMessages: boolean;
  hasFiles: boolean;
  hasInvoice: boolean;
  invoicePaid: boolean;
  bookingDate: Date;
};

export function determineBookingLifecycle({
  status,
  hasMessages,
  hasFiles,
  hasInvoice,
  invoicePaid,
  bookingDate,
}: BookingLifecycleInput): BookingLifecycle {
  if (status === "COMPLETED") {
    if (invoicePaid) {
      return "PAID";
    }

    if (hasInvoice) {
      return "FOLLOW_UP";
    }

    return "COMPLETED";
  }

  const now = new Date();

  if (bookingDate <= now) {
    return "IN_PROGRESS";
  }

  if (hasMessages && hasFiles) {
    return "READY";
  }

  if (hasMessages || hasFiles) {
    return "PREPARING";
  }

  return "BOOKED";
}
