function parseSiteUrl(rawUrl) {
  const fallback = "http://localhost:3000";
  if (!rawUrl) {
    return fallback;
  }

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return fallback;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export const siteUrl = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const oauthProviders = {
  github: {
    id: "github",
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    profileEndpoint: "https://api.github.com/user",
    scope: "read:user user:email",
    callbackPath: "/api/auth/github/callback",
  },
  google: {
    id: "google",
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    profileEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid email profile",
    callbackPath: "/api/auth/google/callback",
  },
};

export function getOAuthProvider(provider) {
  return oauthProviders[provider] ?? null;
}

export function getOAuthCallbackUrl(provider) {
  const definition = getOAuthProvider(provider);
  if (!definition) {
    return null;
  }
  return `${siteUrl}${definition.callbackPath}`;
}

export function getRequiredAuthEnvVars() {
  return [
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "AUTH_SESSION_SECRET",
  ];
}

export function getMissingAuthEnvVars() {
  return getRequiredAuthEnvVars().filter((key) => !process.env[key]);
}
