"use client";

import { useEffect, useState } from "react";
import type { Redirect } from "@/lib/cms/types";

function newId() { return "r_" + Math.random().toString(36).slice(2, 10); }

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Redirect, "id">>({ from: "", to: "", permanent: true, enabled: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (res.ok) {
        const doc = await res.json();
        setRedirects(doc.redirects || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function persist(list: Redirect[]) {
    const res = await fetch("/api/content?draft=1");
    if (!res.ok) throw new Error();
    const doc = await res.json();
    doc.redirects = list;
    const saveRes = await fetch("/api/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(doc),
    });
    if (!saveRes.ok) throw new Error("Save failed");
  }

  async function addRedirect() {
    if (!form.from.trim() || !form.to.trim()) return;
    setSaving(true);
    try {
      const list = [...redirects, { ...form, id: newId(), from: form.from.trim(), to: form.to.trim() }];
      await persist(list);
      setRedirects(list);
      setForm({ from: "", to: "", permanent: true, enabled: true });
      setShowForm(false);
      setMsg("Redirect added — publish to apply");
      setTimeout(() => setMsg(""), 4000);
    } catch (e) {
      setMsg("Error: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(id: string) {
    const list = redirects.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setRedirects(list);
    try { await persist(list); } catch {}
  }

  async function deleteRedirect(id: string) {
    if (!confirm("Delete this redirect?")) return;
    const list = redirects.filter((r) => r.id !== id);
    setRedirects(list);
    try { await persist(list); } catch {}
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Redirects</h1>
          <p className="mt-1 text-sm text-slate-500">Manage 301 and 302 URL redirects — applied after publishing</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Add Redirect
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">New Redirect</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">From (source path) *</label>
              <input
                autoFocus
                type="text"
                value={form.from}
                onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                placeholder="/old-path"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">To (destination) *</label>
              <input
                type="text"
                value={form.to}
                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                placeholder="/new-path or https://…"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.permanent}
                onChange={(e) => setForm((f) => ({ ...f, permanent: e.target.checked }))}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-600">Permanent (301)</span>
            </label>
            <span className="text-xs text-slate-400">Unchecked = Temporary (302)</span>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={addRedirect}
              disabled={saving || !form.from.trim() || !form.to.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Adding…" : "Add Redirect"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm({ from: "", to: "", permanent: true, enabled: true }); }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
      ) : redirects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No redirects configured.</p>
          <button onClick={() => setShowForm(true)} className="mt-2 text-sm font-semibold text-blue-600 hover:underline">
            Add your first redirect →
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">From</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">To</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {redirects.map((r, i) => (
                <tr key={r.id} className={i < redirects.length - 1 ? "border-b border-slate-50" : ""}>
                  <td className="px-5 py-3 font-mono text-xs text-slate-700">{r.from}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-700">{r.to}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.permanent ? "bg-violet-50 text-violet-600 border border-violet-200" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
                      {r.permanent ? "301" : "302"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleEnabled(r.id)}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${r.enabled ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100"}`}
                    >
                      {r.enabled ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteRedirect(r.id)}
                      className="rounded-lg border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
