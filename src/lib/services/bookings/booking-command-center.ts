import { buildBookingEngine } from "@/lib/services/bookings/booking-engine";
import type { BookingCommandCenterRepository } from "./booking-command-center-repository";
import { prismaBookingCommandCenterRepository } from "./prisma-booking-command-center-repository";

type GetBookingCommandCenterInput = {
  bookingId: string;
  workspaceId: string;
};

type BookingCommandCenterDependencies = {
  bookingCommandCenterRepository: BookingCommandCenterRepository;
};

export function createGetBookingCommandCenter(
  dependencies: BookingCommandCenterDependencies,
) {
  return async function getBookingCommandCenter(
    input: GetBookingCommandCenterInput,
  ) {
    const booking =
      await dependencies.bookingCommandCenterRepository.findBooking(input);

    if (!booking) {
      return null;
    }

    const project = booking.project;

    const invoices = project?.invoices ?? [];
    const messages = project?.messages ?? [];
    const files = project?.files ?? [];
    const deposits = project?.deposits ?? [];

    const hasProject = project !== null;

    const hasInvoice = invoices.length > 0;
    const invoicePaid = hasInvoice && invoices.every((invoice) => invoice.paid);

    const hasMessages = messages.length > 0;
    const hasFiles = files.length > 0;

    const hasDeposit = deposits.length > 0;

    const depositRequired = booking.depositRequired;
    const depositAmount = booking.depositAmount;

    const depositTotalRequested = deposits.reduce(
      (sum, deposit) => sum + deposit.amount,
      0,
    );

    const depositTotalPaid = deposits.reduce(
      (depositSum, deposit) =>
        depositSum +
        deposit.payments.reduce(
          (paymentSum, payment) => paymentSum + payment.amount,
          0,
        ),
      0,
    );

    const depositPaid =
      hasDeposit && deposits.every((deposit) => deposit.status === "PAID");

    const depositOutstanding = Math.max(
      0,
      depositTotalRequested - depositTotalPaid,
    );

    const intelligence = buildBookingEngine({
      bookingId: booking.id,
      projectId: project?.id ?? null,
      customerName: booking.customerName,
      serviceName: booking.service.name,
      status: booking.status,
      bookingCreatedAt: booking.createdAt,
      bookingDate: booking.date,
      hasGoogleCalendarEvent: Boolean(booking.googleCalendarEventId),
      hasProject,
      hasInvoice,
      invoicePaid,
      hasMessages,
      hasFiles,
    });

    return {
      booking,
      project,
      invoices,
      messages,
      files,
      deposits,
      financials: {
        depositRequired,
        depositAmount,
        hasDeposit,
        depositTotalRequested,
        depositTotalPaid,
        depositOutstanding,
        depositPaid,
      },
      flags: {
        hasProject,
        hasInvoice,
        invoicePaid,
        hasMessages,
        hasFiles,
        hasDeposit,
        depositPaid,
        calendarSynced: Boolean(booking.googleCalendarEventId),
      },
      intelligence,
    };
  };
}

export const getBookingCommandCenter = createGetBookingCommandCenter({
  bookingCommandCenterRepository: prismaBookingCommandCenterRepository,
});
