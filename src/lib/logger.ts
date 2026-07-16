type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

function log(level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  switch (level) {
    case "debug":
      console.debug(entry);
      break;

    case "info":
      console.info(entry);
      break;

    case "warn":
      console.warn(entry);
      break;

    case "error":
      console.error(entry);
      break;
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    log("debug", message, context);
  },

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
