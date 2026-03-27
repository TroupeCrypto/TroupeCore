import { NextResponse } from "next/server";
import { readSessionCookie, verifySessionToken } from "./lib/auth/session-edge";

const protectedMatchers = ["/admin", "/analytics", "/agents", "/settings"];

function isProtectedPath(pathname) {
  return protectedMatchers.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAuthPath(pathname) {
  return pathname === "/login" || pathname.startsWith("/api/auth/");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isAuthPath(pathname)) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = readSessionCookie(request);
  const session = await verifySessionToken(sessionToken);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/analytics/:path*", "/agents/:path*", "/settings/:path*", "/login", "/api/auth/:path*"],
};
