import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { runWithRequestContext } from "@/lib/request-context";
import { createRequestId } from "@/lib/request-id";

export async function GET() {
  const requestHeaders = await headers();

  const requestId = requestHeaders.get("x-request-id") ?? createRequestId();

  return runWithRequestContext(
    {
      requestId,
    },
    () =>
      NextResponse.json(
        {
          status: "ok",
          service: "vellum",
          requestId,
          timestamp: new Date().toISOString(),
          uptimeSeconds: Math.floor(process.uptime()),
          environment: process.env.NODE_ENV,
        },
        {
          status: 200,
          headers: {
            "cache-control": "no-store, max-age=0",
          },
        },
      ),
  );
}
