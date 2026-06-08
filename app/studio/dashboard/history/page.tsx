"use client";

import { useEffect, useState } from "react";

type Version = { id: string; savedAt: string; label?: string };

function fmtDate(iso: string) {
  try { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso)); }
  catch { return iso; }
}

function timeAgo(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) return Math.floor(diff / 60_000) + "m ago";
    if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + "h ago";
    return Math.floor(diff / 86_400_000) + "d ago";
  } catch { return ""; }
}

export default function HistoryPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/versions");
      if (res.ok) {
        const j = await res.json();
        setVersions(j.versions || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveNow() {
    try {
      const res = await fetch("/api/cms/versions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "save" }) });
      if (res.ok) {
        setMsg("Version saved");
        setTimeout(() => setMsg(""), 3000);
        await load();
      }
    } catch {}
  }

  async function restore(id: string) {
    if (!confirm("Restore this version? Your current draft will be replaced.")) return;
    setRestoring(id);
    try {
      const res = await fetch("/api/cms/versions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "restore", id }),
      });
      if (res.ok) {
        setMsg("Version restored — publish to make it live");
        setTimeout(() => setMsg(""), 5000);
        await load();
      } else {
        setMsg("Restore failed");
      }
    } catch (e) {
      setMsg("Error: " + String(e));
    } finally {
      setRestoring(null);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content History</h1>
          <p className="mt-1 text-sm text-slate-500">Up to 20 saved versions — restore any point in time</p>
        </div>
        <button
          onClick={saveNow}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          Save snapshot now
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</div>
      )}

      <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        A snapshot is automatically saved each time you publish. You can also save a manual snapshot above.
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
      ) : versions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No saved versions yet.</p>
          <button onClick={saveNow} className="mt-2 text-sm font-semibold text-blue-600 hover:underline">
            Save a snapshot now →
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {versions.map((v, i) => (
            <div
              key={v.id}
              className={`flex items-center justify-between px-5 py-4 ${i < versions.length - 1 ? "border-b border-slate-50" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {versions.length - i}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{fmtDate(v.savedAt)}</p>
                  <p className="text-xs text-slate-400">{timeAgo(v.savedAt)}{v.label ? ` · ${v.label}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {i === 0 && (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                    Latest
                  </span>
                )}
                <button
                  onClick={() => restore(v.id)}
                  disabled={restoring === v.id}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  {restoring === v.id ? "Restoring…" : "Restore"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
