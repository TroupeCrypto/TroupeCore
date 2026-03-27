import { NextResponse } from "next/server";
import { clearNextCookieHeader, clearSessionCookieHeader, clearStateCookieHeader } from "../../../../lib/auth/session";
import { siteUrl } from "../../../../lib/auth/config";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", siteUrl));
  response.headers.append("Set-Cookie", clearSessionCookieHeader());
  response.headers.append("Set-Cookie", clearStateCookieHeader());
  response.headers.append("Set-Cookie", clearNextCookieHeader());
  return response;
}
