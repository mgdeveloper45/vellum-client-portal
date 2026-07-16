import { auth } from "@/auth";
import { createRequestId } from "@/lib/request-id";
import { NextResponse } from "next/server";

const publicApiPrefixes = ["/api/auth", "/api/stripe/webhook"];

export default auth((request) => {
  const pathname = request.nextUrl.pathname;

  const isApiRoute = pathname.startsWith("/api/");

  const isPublicApiRoute = publicApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  /*
   * API routes enforce their own authentication or signature checks.
   * Stripe webhooks and Auth.js must remain publicly reachable.
   */
  if (!request.auth && !isApiRoute && !isPublicApiRoute) {
    const redirectResponse = NextResponse.redirect(
      new URL("/sign-in", request.url),
    );

    const requestId = request.headers.get("x-request-id") ?? createRequestId();

    redirectResponse.headers.set("x-request-id", requestId);

    return redirectResponse;
  }

  const requestId = request.headers.get("x-request-id") ?? createRequestId();

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-request-id", requestId);

  return response;
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/messages/:path*",
    "/invoices/:path*",
    "/proposals/:path*",
    "/settings/:path*",
    "/workspace/:path*",
    "/users/:path*",
    "/clients/:path*",
    "/bookings/:path*",
    "/availability/:path*",
    "/services/:path*",
    "/notifications/:path*",
    "/audit-logs/:path*",
    "/search/:path*",
    "/ai/:path*",
    "/api/:path*",
  ],
};
