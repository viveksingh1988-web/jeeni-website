"use client";

import { useEffect, useState } from "react";

type Settings = {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  crmWebhookUrl: string;
  crmProvider: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "", siteDescription: "", logoUrl: "", crmWebhookUrl: "", crmProvider: "webhook",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [dangerConfirm, setDangerConfirm] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (res.ok) {
        const doc = await res.json();
        setSettings({
          siteName: doc.settings?.siteName || "",
          siteDescription: doc.settings?.siteDescription || "",
          logoUrl: doc.settings?.logoUrl || "",
          crmWebhookUrl: doc.settings?.crmWebhookUrl || "",
          crmProvider: doc.settings?.crmProvider || "webhook",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (!res.ok) throw new Error();
      const doc = await res.json();
      doc.settings = { ...doc.settings, ...settings };
      const saveRes = await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(doc),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      setMsg("Settings saved — publish to apply");
      setTimeout(() => setMsg(""), 4000);
    } catch (e) {
      setMsg("Error: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (!pwForm.next.trim()) return;
    if (pwForm.next !== pwForm.confirm) { setPwMsg("Passwords do not match"); return; }
    if (pwForm.next.length < 8) { setPwMsg("Password must be at least 8 characters"); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/cms/login", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setPwMsg("Password changed successfully");
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwMsg(""), 4000);
    } catch (e) {
      setPwMsg("Error: " + String(e));
    } finally {
      setPwSaving(false);
    }
  }

  async function clearDraft() {
    if (dangerConfirm !== "CLEAR") return;
    try {
      const res = await fetch("/api/content?draft=1");
      if (!res.ok) return;
      const doc = await res.json();
      // Reset draft to published state
      const pubRes = await fetch("/api/content");
      if (!pubRes.ok) return;
      const pub = await pubRes.json();
      await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(pub),
      });
      setDangerConfirm("");
      setMsg("Draft cleared — now matches published content");
      setTimeout(() => setMsg(""), 4000);
    } catch {}
  }

  const inputCls = "w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Configure your site and CMS preferences</p>
      </div>

      {msg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</div>
      )}

      {/* Site Info */}
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-800">Site Information</h2>
        {loading ? (
          <div className="text-sm text-slate-400">Loading…</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
                placeholder="Jeeni"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Site Description</label>
              <textarea
                rows={2}
                value={settings.siteDescription}
                onChange={(e) => setSettings((s) => ({ ...s, siteDescription: e.target.value }))}
                placeholder="Brief description of your site…"
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Logo URL</label>
              <input
                type="text"
                value={settings.logoUrl}
                onChange={(e) => setSettings((s) => ({ ...s, logoUrl: e.target.value }))}
                placeholder="https://… (optional)"
                className={inputCls}
              />
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        )}
      </section>

      {/* CRM Integration */}
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-semibold text-slate-800">CRM Integration</h2>
        <p className="mb-4 text-xs text-slate-500">Contact form leads are always stored internally. Optionally forward them to a CRM or Zapier webhook.</p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Webhook URL</label>
            <input
              type="text"
              value={settings.crmWebhookUrl}
              onChange={(e) => setSettings((s) => ({ ...s, crmWebhookUrl: e.target.value }))}
              placeholder="https://hooks.zapier.com/… or HubSpot webhook"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Provider</label>
            <select
              value={settings.crmProvider}
              onChange={(e) => setSettings((s) => ({ ...s, crmProvider: e.target.value }))}
              className={inputCls}
            >
              <option value="webhook">Generic Webhook (Zapier, Make, n8n)</option>
              <option value="hubspot">HubSpot</option>
              <option value="salesforce">Salesforce</option>
              <option value="pipedrive">Pipedrive</option>
            </select>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save CRM Settings"}
          </button>
        </div>
      </section>

      {/* Password */}
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-semibold text-slate-800">Admin Password</h2>
        <p className="mb-4 text-xs text-slate-500">Change the password used to access the CMS studio.</p>
        {pwMsg && (
          <div className={`mb-3 rounded-lg border px-4 py-3 text-sm ${pwMsg.includes("Error") || pwMsg.includes("match") || pwMsg.includes("must") ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{pwMsg}</div>
        )}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Current Password</label>
            <input
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">New Password</label>
            <input
              type="password"
              value={pwForm.next}
              onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              className={inputCls}
            />
          </div>
          <button
            onClick={changePassword}
            disabled={pwSaving || !pwForm.next || !pwForm.current}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50 transition-colors"
          >
            {pwSaving ? "Changing…" : "Change Password"}
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-semibold text-red-700">Danger Zone</h2>
        <p className="mb-4 text-xs text-slate-500">Irreversible actions. Be careful.</p>
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Reset draft to published</p>
          <p className="mt-0.5 text-xs text-slate-500 mb-3">Discard all unsaved draft changes and reset to the last published version.</p>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={dangerConfirm}
              onChange={(e) => setDangerConfirm(e.target.value)}
              placeholder='Type CLEAR to confirm'
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400 w-44"
            />
            <button
              onClick={clearDraft}
              disabled={dangerConfirm !== "CLEAR"}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
            >
              Reset draft
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
