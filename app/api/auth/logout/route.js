import { NextResponse } from "next/server";
import { clearNextCookieHeader, clearSessionCookieHeader, clearStateCookieHeader } from "../../../../lib/auth/session";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  response.headers.append("Set-Cookie", clearSessionCookieHeader());
  response.headers.append("Set-Cookie", clearStateCookieHeader());
  response.headers.append("Set-Cookie", clearNextCookieHeader());
  return response;
}
