import { prisma } from "@/lib/prisma";
import { buildBookingEngine } from "@/lib/services/bookings/booking-engine";

export async function getBookingCommandCenter({
  bookingId,
  workspaceId,
}: {
  bookingId: string;
  workspaceId: string;
}) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      workspaceId,
    },
    include: {
      service: true,
      workspace: true,
    },
  });

  if (!booking) {
    return null;
  }

  const relatedProjects = await prisma.project.findMany({
    where: {
      workspaceId,
      client: {
        email: booking.customerEmail,
      },
    },
    include: {
      invoices: true,
      messages: true,
      files: true,
    },
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
}
