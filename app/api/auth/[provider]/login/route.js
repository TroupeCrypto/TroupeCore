import { NextResponse } from "next/server";
import { buildAuthorizationUrl } from "../../../../../lib/auth/oauth";
import {
  createNextCookieHeader,
  createStateCookieHeader,
  generateStateToken,
  isAuthSessionConfigured,
  normalizeSafeNextPath,
} from "../../../../../lib/auth/session";
import { getOAuthProvider, getMissingAuthEnvVars } from "../../../../../lib/auth/config";

function getMissingProviderVars(provider) {
  if (provider === "github") {
    return ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"];
  }
  if (provider === "google") {
    return ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
  }
  return [];
}

export async function GET(request, { params }) {
  const provider = params?.provider;
  const definition = getOAuthProvider(provider);
  if (!definition) {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 404 });
  }

  if (!isAuthSessionConfigured()) {
    return NextResponse.json(
      {
        error: "Auth session secret is not configured",
        missing: getMissingAuthEnvVars().filter((name) => name === "AUTH_SESSION_SECRET"),
      },
      { status: 500 }
    );
  }

  const missingProvider = getMissingProviderVars(provider).filter((key) => !process.env[key]);
  if (missingProvider.length > 0) {
    return NextResponse.json({ error: "OAuth provider is not configured", missing: missingProvider }, { status: 500 });
  }

  const state = generateStateToken();
  const authorizationUrl = buildAuthorizationUrl(provider, state);
  const nextPath = normalizeSafeNextPath(new URL(request.url).searchParams.get("next"));
  const response = NextResponse.redirect(authorizationUrl);
  response.headers.append("Set-Cookie", createStateCookieHeader(state));
  if (nextPath) {
    response.headers.append("Set-Cookie", createNextCookieHeader(nextPath));
  }
  return response;
}
