import crypto from "crypto";

const SESSION_COOKIE_NAME = "auth_session";
const OAUTH_STATE_COOKIE_NAME = "oauth_state";
const OAUTH_NEXT_COOKIE_NAME = "oauth_next";
const MIN_SESSION_SECRET_LENGTH = 44;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const STATE_MAX_AGE_SECONDS = 60 * 10;
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET ?? "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function normalizeSecret(secret) {
  if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
    return null;
  }
  return secret;
}

function signPayload(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeCompare(a, b) {
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function generateStateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function createStateCookieHeader(value) {
  const secure = IS_PRODUCTION ? "; Secure" : "";
  return `${OAUTH_STATE_COOKIE_NAME}=${value}; Path=/; Max-Age=${STATE_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`;
}

export function clearStateCookieHeader() {
  const secure = IS_PRODUCTION ? "; Secure" : "";
  return `${OAUTH_STATE_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

export function readStateCookie(request) {
  return request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value ?? null;
}

export function verifyStateToken(expectedState, receivedState) {
  return safeCompare(expectedState, receivedState);
}

export function normalizeSafeNextPath(nextPath) {
  if (!nextPath || typeof nextPath !== "string") {
    return null;
  }
  if (!nextPath.startsWith("/")) {
    return null;
  }
  if (nextPath.startsWith("//")) {
    return null;
  }
  return nextPath;
}

export function createNextCookieHeader(nextPath) {
  const normalized = normalizeSafeNextPath(nextPath);
  if (!normalized) {
    return null;
  }
  const secure = IS_PRODUCTION ? "; Secure" : "";
  return `${OAUTH_NEXT_COOKIE_NAME}=${encodeURIComponent(normalized)}; Path=/; Max-Age=${STATE_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`;
}

export function readNextCookie(request) {
  const value = request.cookies.get(OAUTH_NEXT_COOKIE_NAME)?.value;
  if (!value) {
    return null;
  }
  try {
    return normalizeSafeNextPath(decodeURIComponent(value));
  } catch {
    return null;
  }
}

export function clearNextCookieHeader() {
  const secure = IS_PRODUCTION ? "; Secure" : "";
  return `${OAUTH_NEXT_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

export function createSessionToken({ provider, subject, email }) {
  const normalizedSecret = normalizeSecret(SESSION_SECRET);
  if (!normalizedSecret) {
    return null;
  }

  const payload = JSON.stringify({
    provider,
    subject,
    email: email ?? null,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });

  const encodedPayload = Buffer.from(payload, "utf8").toString("base64url");
  const signature = signPayload(encodedPayload, normalizedSecret);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token) {
  const normalizedSecret = normalizeSecret(SESSION_SECRET);
  if (!normalizedSecret || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, normalizedSecret);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) {
    return null;
  }

  return parsed;
}

export function createSessionCookieHeader(token) {
  if (!token) {
    return null;
  }

  const secure = IS_PRODUCTION ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`;
}

export function clearSessionCookieHeader() {
  const secure = IS_PRODUCTION ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

export function readSessionCookie(request) {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export function isAuthSessionConfigured() {
  return Boolean(normalizeSecret(SESSION_SECRET));
}
