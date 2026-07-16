import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { runWithRequestContext } from "@/lib/request-context";
import { createRequestId } from "@/lib/request-id";

export async function GET() {
  const requestHeaders = await headers();

  const requestId = requestHeaders.get("x-request-id") ?? createRequestId();

  return runWithRequestContext(
    {
      requestId,
    },
    async () => {
      const startedAt = performance.now();

      try {
        await prisma.$queryRaw`SELECT 1`;

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
              "cache-control": "no-store, max-age=0",
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
              "cache-control": "no-store, max-age=0",
            },
          },
        );
      }
    },
  );
}
