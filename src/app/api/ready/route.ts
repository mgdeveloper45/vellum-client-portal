import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const requestId = (await headers()).get("x-request-id") ?? "unknown";

  try {
    const started = performance.now();

    await prisma.$queryRaw`SELECT 1`;

    const durationMs = Math.round(performance.now() - started);

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
      },
    );
  } catch {
    return NextResponse.json(
      {
        status: "not_ready",
        requestId,
        checks: {
          database: "failed",
        },

        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
      },
    );
  }
}
