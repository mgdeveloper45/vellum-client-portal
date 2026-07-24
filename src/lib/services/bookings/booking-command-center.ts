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

    const relatedProjects =
      await dependencies.bookingCommandCenterRepository.findRelatedProjects({
        workspaceId: input.workspaceId,
        customerEmail: booking.customerEmail,
      });

    const hasProject = relatedProjects.length > 0;

    const invoices = relatedProjects.flatMap((project) => project.invoices);

    const messages = relatedProjects.flatMap((project) => project.messages);

    const files = relatedProjects.flatMap((project) => project.files);

    const hasInvoice = invoices.length > 0;
    const invoicePaid = invoices.some((invoice) => invoice.paid);
    const hasMessages = messages.length > 0;
    const hasFiles = files.length > 0;

    const intelligence = buildBookingEngine({
      bookingId: booking.id,
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
      relatedProjects,
      invoices,
      messages,
      files,
      flags: {
        hasProject,
        hasInvoice,
        invoicePaid,
        hasMessages,
        hasFiles,
        calendarSynced: Boolean(booking.googleCalendarEventId),
      },
      intelligence,
    };
  };
}

export const getBookingCommandCenter = createGetBookingCommandCenter({
  bookingCommandCenterRepository: prismaBookingCommandCenterRepository,
});
