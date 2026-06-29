import { google } from "googleapis";

type CreateGoogleCalendarEventParams = {
  summary: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  attendeeEmail?: string;
};

export function getGoogleCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({
    version: "v3",
    auth,
  });
}

export async function createGoogleCalendarEvent({
  summary,
  description,
  startDateTime,
  endDateTime,
  attendeeEmail,
}: CreateGoogleCalendarEventParams) {
  if (!process.env.GOOGLE_CALENDAR_ID) {
    return null;
  }

  const calendar = getGoogleCalendarClient();

  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary,
      description: [
        description,
        attendeeEmail ? `Customer email: ${attendeeEmail}` : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
    },
  });

  return event.data;
}

export async function deleteGoogleCalendarEvent(eventId: string) {
  if (!process.env.GOOGLE_CALENDAR_ID) {
    return;
  }

  const calendar = getGoogleCalendarClient();

  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    eventId,
  });
}

type UpdateGoogleCalendarEventParams = {
  eventId: string;
  summary?: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  attendeeEmail?: string;
};

export async function updateGoogleCalendarEvent({
  eventId,
  summary,
  description,
  startDateTime,
  endDateTime,
  attendeeEmail,
}: UpdateGoogleCalendarEventParams) {
  if (!process.env.GOOGLE_CALENDAR_ID) {
    return null;
  }

  const calendar = getGoogleCalendarClient();

  const event = await calendar.events.patch({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    eventId,
    requestBody: {
      summary,
      description: [
        description,
        attendeeEmail ? `Customer email: ${attendeeEmail}` : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
    },
  });

  return event.data;
}
