/* Editor authentication.
 *
 * - Username + password (set via env: CMS_ADMIN_USER / CMS_ADMIN_PASSWORD).
 * - On success we issue an HMAC-signed, expiring session token (JWT-style),
 *   stored in an httpOnly cookie — the raw password is never stored client-side.
 * - Mutating API routes accept that session cookie, or an x-cms-token header
 *   equal to CMS_TOKEN (for headless/programmatic use).
 *
 * Production requires AUTH_SECRET and CMS_ADMIN_PASSWORD to be set; without them
 * auth fails closed (no one can log in) rather than using a known default. */

import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "cms_session";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const isProd = () =>
  process.env.NODE_ENV === "production" || !!process.env.NETLIFY;

function authSecret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  return isProd() ? "" : "dev-insecure-secret-do-not-use-in-prod";
}

export function adminUser(): string {
  return process.env.CMS_ADMIN_USER || "admin";
}

function adminPassword(): string {
  const p = process.env.CMS_ADMIN_PASSWORD || process.env.CMS_TOKEN;
  if (p) return p;
  return isProd() ? "" : "jeeni-admin"; // dev-only default
}

function safeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Verify login credentials (constant-time). */
export function verifyCredentials(username: string, password: string): boolean {
  const pw = adminPassword();
  if (!pw) return false; // no password configured → deny
  return safeEqual(username || "", adminUser()) && safeEqual(password || "", pw);
}

/* ---- Signed session tokens (HMAC-SHA256, base64url, with expiry) ---- */

function sign(payload: string): string {
  return createHmac("sha256", authSecret()).update(payload).digest("base64url");
}

export function createSession(username: string): string {
  const secret = authSecret();
  if (!secret) return "";
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySession(
  token: string | undefined | null
): { u: string } | null {
  const secret = authSecret();
  if (!secret || !token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    return { u: String(data.u) };
  } catch {
    return null;
  }
}

/** True if the cookie value is a valid, unexpired session (used by the layout). */
export function sessionValid(value: string | undefined | null): boolean {
  return verifySession(value) !== null;
}

function cookieFromHeader(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie");
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/** Authorize a mutating request: valid session cookie, or x-cms-token header. */
export function tokenOk(req: Request): boolean {
  if (verifySession(cookieFromHeader(req, SESSION_COOKIE))) return true;
  const headerToken = req.headers.get("x-cms-token");
  const expected =
    process.env.CMS_TOKEN || (isProd() ? "" : "jeeni-admin");
  if (expected && headerToken && safeEqual(headerToken, expected)) return true;
  return false;
}

/** True if the email is in the ADMIN_EMAILS allowlist. In dev (non-Netlify,
 *  non-production) any authenticated OAuth email is allowed when no list is set,
 *  so you can test without configuring the list. In production the list is
 *  required — it fails closed if unset. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = process.env.ADMIN_EMAILS?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean) ?? [];
  if (list.length === 0) {
    return !isProd(); // dev: allow any OAuth user; prod: deny (require explicit list)
  }
  return list.includes(email.toLowerCase());
}

/* ---- Simple in-memory login rate limiting (per process) ---- */
const attempts = new Map<string, { n: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { n: 1, first: now });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_ATTEMPTS;
}
