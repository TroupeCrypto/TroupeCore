import { getOAuthCallbackUrl, getOAuthProvider } from "./config";

function assertProvider(provider) {
  const definition = getOAuthProvider(provider);
  if (!definition) {
    throw new Error("Unsupported OAuth provider");
  }
  return definition;
}

export function buildAuthorizationUrl(provider, state) {
  const definition = assertProvider(provider);
  const redirectUri = getOAuthCallbackUrl(provider);
  if (!definition.clientId || !redirectUri) {
    throw new Error("OAuth provider is not configured");
  }

  const params = new URLSearchParams({
    client_id: definition.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: definition.scope,
    state,
  });

  if (provider === "google") {
    params.set("access_type", "offline");
    params.set("prompt", "consent");
  }

  return `${definition.authorizationEndpoint}?${params.toString()}`;
}

export async function exchangeCodeForAccessToken(provider, code) {
  const definition = assertProvider(provider);
  const redirectUri = getOAuthCallbackUrl(provider);
  if (!definition.clientId || !definition.clientSecret || !redirectUri) {
    throw new Error("OAuth provider is not configured");
  }

  const params = new URLSearchParams({
    client_id: definition.clientId,
    client_secret: definition.clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(definition.tokenEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error("OAuth token exchange failed");
  }

  const accessToken = payload.access_token;
  if (!accessToken) {
    throw new Error("OAuth token response did not include access_token");
  }

  return accessToken;
}

export async function fetchOAuthUserProfile(provider, accessToken) {
  const definition = assertProvider(provider);

  const response = await fetch(definition.profileEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error("OAuth profile fetch failed");
  }

  if (provider === "github") {
    return {
      subject: payload.id ? String(payload.id) : "",
      email: payload.email ?? null,
    };
  }

  return {
    subject: payload.sub ? String(payload.sub) : "",
    email: payload.email ?? null,
  };
}
