import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const requestId =
    (await headers()).get("x-request-id") ?? "unknown";

  return NextResponse.json({
    status: "ok",
    service: "vellum",
    requestId,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
}
