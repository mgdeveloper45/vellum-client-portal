export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogMetadata = Readonly<Record<string, unknown>>;

export interface ErrorDetails {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

const REDACTED_VALUE = "[REDACTED]";

const SENSITIVE_KEYS = new Set([
  "authorization",
  "cookie",
  "cookies",
  "password",
  "passwd",
  "secret",
  "token",
  "accessToken",
  "access_token",
  "refreshToken",
  "refresh_token",
  "apiKey",
  "api_key",
  "stripeSignature",
  "stripe_signature",
  "session",
  "sessionId",
  "session_id",
  "creditCard",
  "credit_card",
  "cardNumber",
  "card_number",
  "cvv",
  "cvc",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof Error)
  );
}

function shouldRedactKey(key: string): boolean {
  const normalizedKey = key.toLowerCase();

  return Array.from(SENSITIVE_KEYS).some((sensitiveKey) =>
    normalizedKey.includes(sensitiveKey.toLowerCase()),
  );
}

function sanitizeValue(value: unknown, seen: WeakSet<object>): unknown {
  if (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return serializeError(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, seen));
  }

  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }

    seen.add(value);

    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, entryValue]) => [
          key,
          shouldRedactKey(key)
            ? REDACTED_VALUE
            : sanitizeValue(entryValue, seen),
        ]),
      );
    }

    return String(value);
  }

  return String(value);
}

export function sanitizeLogMetadata(metadata: LogMetadata): LogMetadata {
  return sanitizeValue(metadata, new WeakSet<object>()) as LogMetadata;
}

export function serializeError(error: unknown): ErrorDetails {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV !== "production" && error.stack
        ? { stack: error.stack }
        : {}),
      ...(error.cause !== undefined
        ? {
            cause: sanitizeValue(error.cause, new WeakSet<object>()),
          }
        : {}),
    };
  }

  return {
    name: "UnknownError",
    message: typeof error === "string" ? error : "An unknown error occurred.",
    cause: sanitizeValue(error, new WeakSet<object>()),
  };
}

function writeLog(
  level: LogLevel,
  message: string,
  metadata: LogMetadata = {},
): void {
  if (level === "debug" && process.env.NODE_ENV === "production") {
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    environment: process.env.NODE_ENV ?? "development",
    ...sanitizeLogMetadata(metadata),
  };

  const serializedEntry = JSON.stringify(entry);

  switch (level) {
    case "debug":
      console.debug(serializedEntry);
      return;

    case "info":
      console.info(serializedEntry);
      return;

    case "warn":
      console.warn(serializedEntry);
      return;

    case "error":
      console.error(serializedEntry);
      return;
  }
}

export const logger = Object.freeze({
  debug(message: string, metadata?: LogMetadata): void {
    writeLog("debug", message, metadata);
  },

  info(message: string, metadata?: LogMetadata): void {
    writeLog("info", message, metadata);
  },

  warn(message: string, metadata?: LogMetadata): void {
    writeLog("warn", message, metadata);
  },

  error(message: string, error?: unknown, metadata: LogMetadata = {}): void {
    writeLog("error", message, {
      ...metadata,
      ...(error === undefined
        ? {}
        : {
            error: serializeError(error),
          }),
    });
  },
});
