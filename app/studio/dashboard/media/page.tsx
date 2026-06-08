"use client";

import { useEffect, useRef, useState } from "react";

type Asset = { key: string; url: string; contentType: string; kind: string; uploadedAt: number; size?: number };

function fmtSize(b?: number) {
  if (!b) return "";
  if (b > 1_000_000) return (b / 1_000_000).toFixed(1) + " MB";
  if (b > 1000) return (b / 1000).toFixed(0) + " KB";
  return b + " B";
}

function fmtDate(ts: number) {
  if (!ts) return "";
  try { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(ts * 1000)); }
  catch { return ""; }
}

export default function MediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "pdf">("all");
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const j = await res.json();
        setAssets(j.media || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/media", { method: "POST", body: fd });
        if (res.ok) uploaded++;
      } catch {}
    }
    setMsg(`Uploaded ${uploaded} file${uploaded !== 1 ? "s" : ""}`);
    setTimeout(() => setMsg(""), 3000);
    setUploading(false);
    await load();
  }

  async function deleteAsset(key: string) {
    if (!confirm("Delete this asset?")) return;
    setDeleting(key);
    try {
      await fetch(`/api/media/${key}`, { method: "DELETE" });
      await load();
    } finally {
      setDeleting(null);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(window.location.origin + url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  }

  const filtered = assets.filter((a) => filter === "all" || a.kind === filter);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="mt-1 text-sm text-slate-500">{assets.length} assets uploaded</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {uploading ? "Uploading…" : "↑ Upload"}
          </button>
        </div>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</div>
      )}

      {/* Filter tabs */}
      <div className="mb-5 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm w-fit">
        {(["all", "image", "pdf"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors capitalize ${
              filter === f ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "all" ? `All (${assets.length})` : f === "image" ? `Images (${assets.filter((a) => a.kind === "image").length})` : `PDFs (${assets.filter((a) => a.kind === "pdf").length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-16 text-center shadow-sm cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium text-slate-500">Drop files here or click to upload</p>
          <p className="mt-1 text-xs text-slate-400">Images and PDFs supported</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((asset) => (
            <div key={asset.key} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
              {asset.kind === "image" ? (
                <div className="aspect-square overflow-hidden bg-slate-50">
                  <img src={asset.url} alt={asset.key} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-red-50">
                  <svg className="h-12 w-12 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                  </svg>
                </div>
              )}
              <div className="p-3">
                <p className="truncate text-xs font-medium text-slate-700">{asset.key.split("/").pop()}</p>
                <p className="text-[11px] text-slate-400">{fmtSize(asset.size)} · {fmtDate(asset.uploadedAt)}</p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => copyUrl(asset.url)}
                    className="flex-1 rounded-md border border-slate-200 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {copied === asset.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => deleteAsset(asset.key)}
                    disabled={deleting === asset.key}
                    className="rounded-md border border-red-100 px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {deleting === asset.key ? "…" : "✕"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
