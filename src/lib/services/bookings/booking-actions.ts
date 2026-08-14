import type { BookingHealthResult } from "@/lib/services/bookings/booking-health";

type BookingActionPriority = "HIGH" | "MEDIUM" | "LOW";

type BookingRecommendedActionBase = {
  id: string;
  title: string;
  description: string;
  priority: BookingActionPriority;
};

export type BookingRecommendedAction =
  | (BookingRecommendedActionBase & {
      type: "NAVIGATION";
      href: string;
    })
  | (BookingRecommendedActionBase & {
      type: "COMMAND";
      command: "CREATE_PROJECT";
      bookingId: string;
    });

type BuildBookingActionsParams = {
  bookingId: string;
  projectId: string | null;
  unpaidInvoiceId: string | null;
  hasMultipleUnpaidInvoices: boolean;
  health: BookingHealthResult;
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

export function buildBookingRecommendedActions({
  bookingId,
  projectId,
  unpaidInvoiceId,
  hasMultipleUnpaidInvoices,
  health,
  hasProject,
  hasInvoice,
  invoicePaid,
  hasMessages,
  hasFiles,
  depositRequired,
  hasDeposit,
  depositPaid,
  depositOutstanding,
}: BuildBookingActionsParams): BookingRecommendedAction[] {
  const actions: BookingRecommendedAction[] = [];

  if (!hasProject) {
    actions.push({
      id: "create-project",
      type: "COMMAND",
      command: "CREATE_PROJECT",
      bookingId,
      title: "Create project",
      description: "Turn this booking into a client project.",
      priority: "HIGH",
    });
  }

  if (hasProject && projectId && !hasMessages) {
    actions.push({
      id: "message-client",
      type: "NAVIGATION",
      title: "Message client",
      description: "Send a quick follow-up or preparation note.",
      href: `/projects/${projectId}#messages`,
      priority: "MEDIUM",
    });
  }

  if (hasProject && projectId && !hasFiles) {
    actions.push({
      id: "request-files",
      type: "NAVIGATION",
      title: "Request files",
      description: "Upload or manage files for this booking's project.",
      href: `/projects/${projectId}#files`,
      priority: "MEDIUM",
    });
  }

  if (hasProject && projectId && depositRequired && !hasDeposit) {
    actions.push({
      id: "request-deposit",
      type: "NAVIGATION",
      title: "Request deposit",
      description: "Request the required deposit for this booking.",
      href: `/projects/${projectId}#deposits`,
      priority: "HIGH",
    });
  }

  if (
    hasProject &&
    projectId &&
    depositRequired &&
    hasDeposit &&
    !depositPaid &&
    depositOutstanding > 0
  ) {
    actions.push({
      id: "collect-deposit",
      type: "NAVIGATION",
      title: "Collect deposit",
      description: "Collect the outstanding deposit balance.",
      href: `/projects/${projectId}#deposits`,
      priority: "HIGH",
    });
  }

  if (hasProject && projectId && !hasInvoice) {
    actions.push({
      id: "create-invoice",
      type: "NAVIGATION",
      title: "Create invoice",
      description: "Prepare billing for this booking.",
      href: `/projects/${projectId}#invoices`,
      priority: "MEDIUM",
    });
  }

  if (hasInvoice && !invoicePaid) {
    actions.push({
      id: "follow-up-payment",
      type: "NAVIGATION",
      title: "Follow up on payment",
      description: "Invoice exists but has not been paid yet.",
      href:
        unpaidInvoiceId && !hasMultipleUnpaidInvoices
          ? `/ai/invoice-reminder/${unpaidInvoiceId}`
          : projectId
            ? `/projects/${projectId}#invoices`
            : "/invoices",
      priority: "HIGH",
    });
  }

  if (health.label === "HEALTHY" && actions.length === 0) {
    actions.push({
      id: "all-clear",
      type: "NAVIGATION",
      title: "Booking is on track",
      description: "No urgent follow-up needed right now.",
      href: `/bookings/${bookingId}`,
      priority: "LOW",
    });
  }

  return actions;
}
