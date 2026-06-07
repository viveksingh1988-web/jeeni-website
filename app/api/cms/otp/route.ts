import { NextResponse } from "next/server";
import { getStore } from "@/lib/cms/store";
import { createSession, SESSION_COOKIE, SESSION_TTL_MS, rateLimited } from "@/lib/cms/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/* Uses textbelt (https://github.com/typpo/textbelt — open source, MIT).
 *   Dev / free tier : key = "textbelt" (1 free SMS/day via textbelt.com)
 *   Paid textbelt   : set TEXTBELT_KEY to your paid key
 *   Self-hosted     : run the textbelt server locally and set TEXTBELT_URL
 *   No config       : OTP is printed to the server console (test without SMS) */
async function sendSms(to: string, otp: string) {
  const base = process.env.TEXTBELT_URL ?? "https://textbelt.com";
  const key = process.env.TEXTBELT_KEY ?? "textbelt"; // "textbelt" = free tier

  if (!process.env.TEXTBELT_URL && !process.env.TEXTBELT_KEY) {
    // No SMS configured — print to console for local testing
    console.log(`\n┌─────────────────────────────────────────┐`);
    console.log(`│  📱 OTP for ${to.padEnd(20)}         │`);
    console.log(`│                                         │`);
    console.log(`│   Code: ${otp}   (valid 5 min)         │`);
    console.log(`│   (set TEXTBELT_KEY to send real SMS)  │`);
    console.log(`└─────────────────────────────────────────┘\n`);
    return;
  }

  const res = await fetch(`${base}/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: to,
      message: `Your Jeeni Studio code: ${otp}. Valid 5 min.`,
      key,
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!j.success) throw new Error(j.error || `textbelt error (status ${res.status})`);
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let body: { action?: string; phone?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const phone = (body.phone || "").trim();
  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const store = getStore();

  if (body.action === "send") {
    const otp = genOtp();
    const isDevMode = !process.env.TEXTBELT_URL && !process.env.TEXTBELT_KEY;
    try {
      await store.storeOtp(phone, otp);
      await sendSms(phone, otp);
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to send SMS: " + String(e) },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, ...(isDevMode ? { devCode: otp } : {}) });
  }

  if (body.action === "verify") {
    const code = (body.code || "").trim();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    const valid = await store.verifyAndConsumeOtp(phone, code);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 }
      );
    }
    // Issue a session cookie for the phone admin.
    const token = createSession(phone);
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

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
