const SESSION_COOKIE_NAME = "auth_session";
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET ?? "";
const MIN_SESSION_SECRET_LENGTH = 44;

function normalizeSecret(secret) {
  if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
    return null;
  }
  return secret;
}

function decodeBase64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeBytesToBase64Url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function signPayload(payload, secret) {
  const keyData = new TextEncoder().encode(secret);
  const payloadData = new TextEncoder().encode(payload);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, payloadData);
  return encodeBytesToBase64Url(new Uint8Array(signature));
}

function parseTokenPayload(encodedPayload) {
  try {
    const bytes = decodeBase64UrlToBytes(encodedPayload);
    const raw = new TextDecoder().decode(bytes);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function readSessionCookie(request) {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function verifySessionToken(token) {
  const normalizedSecret = normalizeSecret(SESSION_SECRET);
  if (!normalizedSecret || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expected = await signPayload(encodedPayload, normalizedSecret);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  const parsed = parseTokenPayload(encodedPayload);
  if (!parsed || !parsed.expiresAt || parsed.expiresAt <= Date.now()) {
    return null;
  }

  return parsed;
}
