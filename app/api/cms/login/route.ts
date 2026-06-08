import { NextResponse } from "next/server";
import {
  verifyCredentials,
  createSession,
  rateLimited,
  adminUser,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "@/lib/cms/auth";
import { isAdminRequest } from "@/lib/cms/admin-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* POST /api/cms/login { username?, password } → signed session cookie. */
export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Username optional in the form; defaults to the configured admin user.
  const username = body.username || adminUser();
  if (!verifyCredentials(username, body.password || "")) {
    return NextResponse.json(
      { error: "Incorrect username or password" },
      { status: 401 }
    );
  }

  const token = createSession(username);
  if (!token) {
    return NextResponse.json(
      { error: "Server auth not configured (set AUTH_SECRET)." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}

/* DELETE /api/cms/login → log out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

/* PATCH /api/cms/login { currentPassword, newPassword } → change admin password.
 * This updates the CMS_ADMIN_PASSWORD env override stored in the draft settings. */
export async function PATCH(req: Request) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { currentPassword?: string; newPassword?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both currentPassword and newPassword are required" }, { status: 400 });
  }
  if (!verifyCredentials(adminUser(), currentPassword)) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }
  // Store the new password in the draft doc's settings so it persists.
  const { getStore } = await import("@/lib/cms/store");
  const store = getStore();
  const draft = await store.getDraft();
  const updated = { ...draft, settings: { ...draft.settings, _adminPassword: newPassword } };
  await store.saveDraft(updated as typeof draft);
  // Note: this only works when CMS_ADMIN_PASSWORD is not hard-set in env.
  return NextResponse.json({ ok: true, note: "Password change stored in draft. Set CMS_ADMIN_PASSWORD env var in production for permanent effect." });
}
