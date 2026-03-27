import { NextResponse } from "next/server";
import { exchangeCodeForAccessToken, fetchOAuthUserProfile } from "../../../../../lib/auth/oauth";
import {
  clearNextCookieHeader,
  clearStateCookieHeader,
  createSessionCookieHeader,
  createSessionToken,
  isAuthSessionConfigured,
  normalizeSafeNextPath,
  readNextCookie,
  readStateCookie,
  verifyStateToken,
} from "../../../../../lib/auth/session";
import { getOAuthProvider } from "../../../../../lib/auth/config";

function oauthErrorResponse(requestUrl) {
  return NextResponse.redirect(new URL("/login?error=oauth_failed", requestUrl));
}

export async function GET(request, { params }) {
  const provider = params?.provider;
  if (!getOAuthProvider(provider)) {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 404 });
  }

  if (!isAuthSessionConfigured()) {
    return NextResponse.json({ error: "Auth session secret is not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing OAuth code or state" }, { status: 400 });
  }

  const expectedState = readStateCookie(request);
  if (!expectedState || !verifyStateToken(expectedState, state)) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  try {
    const accessToken = await exchangeCodeForAccessToken(provider, code);
    const profile = await fetchOAuthUserProfile(provider, accessToken);

    if (!profile.subject) {
      return NextResponse.json({ error: "Invalid OAuth profile response" }, { status: 502 });
    }

    const sessionToken = createSessionToken({
      provider,
      subject: profile.subject,
      email: profile.email,
    });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unable to create auth session" }, { status: 500 });
    }

    const nextPath = normalizeSafeNextPath(readNextCookie(request)) ?? "/admin";
    const response = NextResponse.redirect(new URL(nextPath, url));
    response.headers.append("Set-Cookie", createSessionCookieHeader(sessionToken));
    response.headers.append("Set-Cookie", clearStateCookieHeader());
    response.headers.append("Set-Cookie", clearNextCookieHeader());
    return response;
  } catch {
    const response = oauthErrorResponse(url);
    response.headers.append("Set-Cookie", clearStateCookieHeader());
    response.headers.append("Set-Cookie", clearNextCookieHeader());
    return response;
  }
}
