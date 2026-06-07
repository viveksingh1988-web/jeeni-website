import { NextResponse } from "next/server";
import {
  verifyCredentials,
  createSession,
  rateLimited,
  adminUser,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "@/lib/cms/auth";

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
