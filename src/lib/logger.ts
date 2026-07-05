type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function log(level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  if (level === "error") {
    console.error(entry);
    return;
  }

  if (level === "warn") {
    console.warn(entry);
    return;
  }

  console.log(entry);
}

export const logger = {
  info(message: string, context?: LogContext) {
    log("info", message, context);
  },

  warn(message: string, context?: LogContext) {
    log("warn", message, context);
  },

  error(message: string, context?: LogContext) {
    log("error", message, context);
  },
};
