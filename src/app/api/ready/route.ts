import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { runWithRequestContext } from "@/lib/request-context";
import { createRequestId } from "@/lib/request-id";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATABASE_TIMEOUT_MS = 5_000;

async function checkDatabase(): Promise<void> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(
            new Error(
              `Database readiness check exceeded ${DATABASE_TIMEOUT_MS}ms.`,
            ),
          );
        }, DATABASE_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

export async function GET(): Promise<NextResponse> {
  const requestHeaders = await headers();

  const requestId = requestHeaders.get("x-request-id") ?? createRequestId();

  return runWithRequestContext(
    {
      requestId,
    },
    async () => {
      const startedAt = performance.now();

      try {
        await checkDatabase();

        const durationMs = Math.round(performance.now() - startedAt);

        logger.info("Readiness check passed", {
          component: "health",
          check: "database",
          durationMs,
          status: "ready",
        });

        return NextResponse.json(
          {
            status: "ready",
            requestId,
            checks: {
              database: "ok",
            },
            durationMs,
            timestamp: new Date().toISOString(),
          },
          {
            status: 200,
            headers: {
              "Cache-Control": "no-store, max-age=0",
              "X-Request-Id": requestId,
            },
          },
        );
      } catch (error) {
        const durationMs = Math.round(performance.now() - startedAt);

        logger.error("Readiness check failed", {
          component: "health",
          check: "database",
          durationMs,
          status: "not_ready",
          errorName: error instanceof Error ? error.name : "UnknownError",
          errorMessage:
            error instanceof Error ? error.message : "Unknown readiness error",
        });

        return NextResponse.json(
          {
            status: "not_ready",
            requestId,
            checks: {
              database: "failed",
            },
            durationMs,
            timestamp: new Date().toISOString(),
          },
          {
            status: 503,
            headers: {
              "Cache-Control": "no-store, max-age=0",
              "Retry-After": "10",
              "X-Request-Id": requestId,
            },
          },
        );
      }
    },
  );
}
