import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {

  if (!req.auth) {
    return NextResponse.redirect(
      new URL("/sign-in", req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/messages/:path*",
    "/invoices/:path*",
    "/proposals/:path*",
    "/settings/:path*",
  ],
};