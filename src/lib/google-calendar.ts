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
      description,
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
      attendees: attendeeEmail
        ? [
            {
              email: attendeeEmail,
            },
          ]
        : undefined,
    },
  });

  return event.data;
}
