import { headers } from "next/headers";

export async function GET() {
  const requestId = (await headers()).get("x-request-id") ?? "unknown";

  return Response.json({
    status: "ok",
    requestId,
    timestamp: new Date().toISOString(),
  });
}
