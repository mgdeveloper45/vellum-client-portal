import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { createRequestId } from "@/lib/request-id";

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const response = NextResponse.next();

  response.headers.set("x-request-id", createRequestId());

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
    "/api/:path*",
  ],
};
