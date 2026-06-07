"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type Providers = { google: boolean };

export function StudioLoginClient({
  providers,
  errorMsg,
}: {
  providers: Providers;
  errorMsg?: string;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#060d1f]">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue/20 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-navy/40 blur-[100px]" />
        <div className="absolute -right-20 top-1/3 h-[350px] w-[350px] rounded-full bg-gold/10 blur-[100px]" />
      </div>

      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating decorative rings */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[12%] h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute right-[6%] top-[8%] h-96 w-96 rounded-full border border-white/5" />
        <div className="absolute bottom-[10%] left-[20%] h-48 w-48 rounded-full border border-blue/10" />
        <div className="absolute bottom-[18%] right-[12%] h-72 w-72 rounded-full border border-white/5" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue via-blue-bright to-gold shadow-[0_0_40px_rgba(37,99,235,0.4)]">
            <span className="text-3xl font-bold text-white">J</span>
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">
              Jeeni Studio
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Sign in to manage your site
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* OAuth */}
          <div>
            <OAuthBtn
              label="Continue with Google"
              icon={GoogleIcon}
              available={providers.google}
              onClick={() => signIn("google", { callbackUrl: "/" })}
            />
          </div>

          <Divider />
          <PhoneOTP />
          <Divider />
          <PasswordForm />
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          Authorised admins only · Jeeni Studio
        </p>
      </div>
    </div>
  );
}

/* ── OAuth button ── */
function OAuthBtn({
  label,
  icon: Icon,
  available,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!available}
      title={available ? undefined : "Add provider credentials to .env.local to enable"}
      className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="h-5 w-5 flex-none" />
      <span className="flex-1 text-left">{label}</span>
      {!available && (
        <span className="text-xs font-normal text-white/30">Not configured</span>
      )}
    </button>
  );
}

/* ── Phone OTP ── */
function PhoneOTP() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue/60 focus:bg-white/10";

  async function sendCode() {
    if (!phone.trim()) return;
    setBusy(true);
    setError("");
    setDevCode("");
    try {
      const r = await fetch("/api/cms/otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "send", phone: phone.trim() }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setStep("code");
      if (j.devCode) {
        setDevCode(j.devCode);
        setCode(j.devCode);
      }
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (code.length < 6) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/cms/otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "verify", phone: phone.trim(), code: code.trim() }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      window.location.href = "/";
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/35">
        Phone verification
      </p>
      {step === "phone" ? (
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendCode()}
            placeholder="+1 555 000 0000"
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={busy || !phone.trim()}
            className="rounded-xl bg-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-bright disabled:opacity-50"
          >
            {busy ? "…" : "Send"}
          </button>
        </div>
      ) : (
        <div>
          {devCode && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
              <span className="text-xs text-amber-400/70">Dev mode · code auto-filled:</span>
              <span className="font-mono text-sm font-bold tracking-widest text-amber-300">{devCode}</span>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              placeholder="000000"
              maxLength={6}
              autoFocus
              className={`${inputCls} flex-1 text-center text-2xl font-mono font-bold tracking-[0.5em]`}
            />
            <button
              type="button"
              onClick={verify}
              disabled={busy || code.length < 6}
              className="rounded-xl bg-gradient-to-r from-blue to-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? "…" : "Verify"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setStep("phone"); setCode(""); setError(""); }}
            className="mt-2 text-xs text-white/30 hover:text-white/60"
          >
            ← Change number
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

/* ── Password (collapsed) ── */
function PasswordForm() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue/60 focus:bg-white/10";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      window.location.href = "/";
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-white/30 hover:text-white/60 transition"
      >
        <span className="text-[10px]">{open ? "▲" : "▼"}</span>
        Sign in with username &amp; password
      </button>
      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2">
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={inputCls}
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputCls}
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-xl bg-gradient-to-r from-blue to-navy py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in →"}
          </button>
        </form>
      )}
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/8" />
      <span className="text-[11px] text-white/20">or</span>
      <span className="h-px flex-1 bg-white/8" />
    </div>
  );
}

/* ── Icons ── */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

