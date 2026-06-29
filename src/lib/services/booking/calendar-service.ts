import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  updateGoogleCalendarEvent,
} from "@/lib/google-calendar";

type BookingCalendarEventParams = {
  eventId?: string | null;
  summary: string;
  description?: string | null;
  startDateTime: Date;
  endDateTime: Date;
  attendeeEmail?: string | null;
};

export async function createBookingCalendarEvent({
  summary,
  description,
  startDateTime,
  endDateTime,
  attendeeEmail,
}: BookingCalendarEventParams) {
  return createGoogleCalendarEvent({
    summary,
    description: description || undefined,
    startDateTime,
    endDateTime,
    attendeeEmail: attendeeEmail || undefined,
  });
}

export async function updateBookingCalendarEvent({
  eventId,
  summary,
  description,
  startDateTime,
  endDateTime,
  attendeeEmail,
}: BookingCalendarEventParams) {
  if (!eventId) {
    return null;
  }

  return updateGoogleCalendarEvent({
    eventId,
    summary,
    description: description || undefined,
    startDateTime,
    endDateTime,
    attendeeEmail: attendeeEmail || undefined,
  });
}

export async function deleteBookingCalendarEvent(eventId?: string | null) {
  if (!eventId) {
    return;
  }

  await deleteGoogleCalendarEvent(eventId);
}
