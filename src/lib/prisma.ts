import "dotenv/config";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logger } from "@/lib/logger";

const SLOW_QUERY_THRESHOLD_MS = Number(
  process.env.PRISMA_SLOW_QUERY_THRESHOLD_MS ?? 500,
);

/**
 * Prisma 7 requires a database adapter.
 */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

function createPrismaClient() {
  const baseClient = new PrismaClient({
    adapter,
    log: [
      {
        emit: "event",
        level: "warn",
      },
      {
        emit: "event",
        level: "error",
      },
    ],
  });

  baseClient.$on("warn", (event) => {
    logger.warn("Prisma warning", {
      component: "database",
      target: event.target,
      message: event.message,
    });
  });

  baseClient.$on("error", (event) => {
    logger.error("Prisma client error", {
      component: "database",
      target: event.target,
      message: event.message,
    });
  });

  return baseClient.$extends({
    name: "request-correlated-query-logging",

    query: {
      async $allOperations({ model, operation, args, query }) {
        const startedAt = performance.now();

        try {
          const result = await query(args);

          const durationMs = Math.round(performance.now() - startedAt);

          const context = {
            component: "database",
            model: model ?? "raw",
            operation,
            durationMs,
            status: "success",
          };

          if (durationMs >= SLOW_QUERY_THRESHOLD_MS) {
            logger.warn("Slow Prisma operation", context);
          } else if (process.env.NODE_ENV !== "production") {
            logger.debug("Prisma operation completed", context);
          }

          return result;
        } catch (error) {
          const durationMs = Math.round(performance.now() - startedAt);

          logger.error("Prisma operation failed", {
            component: "database",
            model: model ?? "raw",
            operation,
            durationMs,
            status: "error",
            errorName: error instanceof Error ? error.name : "UnknownError",
            errorMessage:
              error instanceof Error ? error.message : "Unknown database error",
          });

          throw error;
        }
      },
    },
  });
}

type PrismaClientInstance = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientInstance;
};

/**
 * Shared Prisma client used across the app.
 * Reuse the instance during development to avoid
 * exhausting database connections during hot reloads.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
