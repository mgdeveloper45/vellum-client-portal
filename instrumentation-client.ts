import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV,

  enabled:
    process.env.NODE_ENV === "production" &&
    Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  tracesSampleRate: 0.1,

  // Start privacy-first. We can enable replay later
  // after reviewing data masking and retention.
  sendDefaultPii: false,

  enableLogs: true,
});
