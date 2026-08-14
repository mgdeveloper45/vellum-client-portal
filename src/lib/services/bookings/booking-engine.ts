import { buildBookingAISummary } from "@/lib/services/bookings/booking-ai";
import { buildBookingTimeline } from "@/lib/services/bookings/booking-timeline";
import { calculateBookingHealth } from "@/lib/services/bookings/booking-health";
import { getBookingCountdown } from "@/lib/services/bookings/booking-countdown";
import { determineBookingMission } from "@/lib/services/bookings/booking-mission";
import { determineBookingLifecycle } from "@/lib/services/bookings/booking-lifecycle";
import { buildBookingRecommendedActions } from "@/lib/services/bookings/booking-actions";

type BuildBookingEngineParams = {
  bookingId: string;
  projectId: string | null;
  unpaidInvoiceId: string | null;
  hasMultipleUnpaidInvoices: boolean;
  customerName: string;
  serviceName: string;
  status: string;
  bookingCreatedAt: Date;
  bookingDate: Date;
  hasGoogleCalendarEvent: boolean;
  hasProject: boolean;
  hasInvoice: boolean;
  invoicePaid: boolean;
  hasMessages: boolean;
  hasFiles: boolean;
};

export function buildBookingEngine({
  bookingId,
  projectId,
  unpaidInvoiceId,
  hasMultipleUnpaidInvoices,
  customerName,
  serviceName,
  status,
  bookingCreatedAt,
  bookingDate,
  hasGoogleCalendarEvent,
  hasProject,
  hasInvoice,
  invoicePaid,
  hasMessages,
  hasFiles,
}: BuildBookingEngineParams) {
  const timeline = buildBookingTimeline({
    bookingCreatedAt,
    hasProject,
    hasInvoice,
    invoicePaid,
    hasMessages,
    hasFiles,
  });

  const health = calculateBookingHealth({
    status,
    bookingDate,
    hasCalendarEvent: hasGoogleCalendarEvent,
    hasProject,
    hasInvoice,
    invoicePaid,
    hasMessages,
    hasFiles,
  });

  const actions = buildBookingRecommendedActions({
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
  });

  const countdown = getBookingCountdown(bookingDate);

  const lifecycle = determineBookingLifecycle({
    status,
    hasMessages,
    hasFiles,
    hasInvoice,
    invoicePaid,
    bookingDate,
  });

  const mission = determineBookingMission({
    lifecycle,
    health,
    countdown,
    actions,
  });

  const aiSummary = buildBookingAISummary({
    customerName,
    serviceName,
    health,
    mission,
    countdown,
  });

  return {
    timeline,
    health,
    lifecycle,
    countdown,
    actions,
    mission,
    aiSummary,
  };
}
