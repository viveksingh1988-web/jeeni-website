"use client";

import { useCMS } from "./edit-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { STOCK, STOCK_GROUPS, stockFull, stockThumb } from "@/lib/cms/stock";

type Asset = {
  key: string;
  url: string;
  contentType: string;
  kind: "image" | "pdf" | "other";
  uploadedAt: number;
  size?: number;
};

type View = "stock" | "uploads" | "pdfs";

function fmtSize(n?: number) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/* The DAM. Upload, browse, delete, and pick from a built-in stock library
   (HD + 3D images) or your own uploads (images + PDFs). Opened via
   cms.pickMedia() / cms.openAssets(). */
export function MediaLibrary() {
  const cms = useCMS();
  const open = !!cms?.library.open;
  const accept = cms?.library.accept ?? "all";

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<View>("stock");
  const [stockGroup, setStockGroup] = useState<string>(STOCK_GROUPS[0].id);
  const fileRef = useRef<HTMLInputElement>(null);

  const token = cms?.token;
  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Cookies are sent automatically for same-origin fetches; token header
      // is kept as a fallback for non-cookie auth environments.
      const res = await fetch("/api/media", {
        headers: token ? { "x-cms-token": token } : {},
      });
      const j = await res.json();
      setAssets(j.assets ?? []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (open) {
      setView(accept === "pdf" ? "pdfs" : "stock");
      load();
    }
  }, [open, accept, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cms?.resolveLibrary(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cms]);

  if (!cms || !open) return null;

  const picking = accept !== "all";
  const canStock = accept !== "pdf"; // stock = images only
  const uploadedImages = assets.filter((a) => a.kind === "image");
  const uploadedPdfs = assets.filter((a) => a.kind === "pdf");

  function pickUrl(url: string) {
    if (picking) cms!.resolveLibrary(url);
    else navigator.clipboard?.writeText(url);
  }

  async function onUpload(files: FileList | null) {
    if (!files || !cms) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/media", {
          method: "POST",
          headers: { "x-cms-token": cms.token },
          body: fd,
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          alert("Upload failed: " + (j.error || res.status));
        }
      }
      await load();
      setView(files[0]?.type === "application/pdf" ? "pdfs" : "uploads");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(key: string) {
    if (!cms || !window.confirm("Delete this asset permanently?")) return;
    await fetch(`/api/media?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: { "x-cms-token": cms.token },
    });
    setAssets((a) => a.filter((x) => x.key !== key));
  }

  const Tab = ({ id, label }: { id: View; label: string }) => (
    <button
      className={`cms-tab ${view === id ? "cms-tab-on" : ""}`}
      onClick={() => setView(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="cms-modal-backdrop" onClick={() => cms.resolveLibrary(null)}>
      <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cms-modal-head">
          <h2 className="text-lg font-bold text-foreground">
            {picking ? "Choose an asset" : "Asset library"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="cms-btn-primary"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              {busy ? "Uploading…" : "⤓ Upload"}
            </button>
            <button
              type="button"
              className="cms-btn-ghost"
              onClick={() => cms.resolveLibrary(null)}
            >
              ✕
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              accept={
                accept === "pdf"
                  ? "application/pdf"
                  : accept === "image"
                    ? "image/*"
                    : "image/*,application/pdf"
              }
              onChange={(e) => {
                onUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <div className="cms-tabs">
          {canStock && <Tab id="stock" label="✦ Stock library" />}
          {canStock && <Tab id="uploads" label={`Your images${uploadedImages.length ? ` (${uploadedImages.length})` : ""}`} />}
          {(accept === "all" || accept === "pdf") && (
            <Tab id="pdfs" label={`PDFs${uploadedPdfs.length ? ` (${uploadedPdfs.length})` : ""}`} />
          )}
        </div>

        {view === "stock" && (
          <div className="cms-substabs">
            {STOCK_GROUPS.map((g) => (
              <button
                key={g.id}
                className={`cms-subtab ${stockGroup === g.id ? "cms-subtab-on" : ""}`}
                onClick={() => setStockGroup(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        <div className="cms-modal-body">
          {view === "stock" ? (
            <div className="cms-grid">
              {STOCK.filter((s) => s.group === stockGroup).map((s) => (
                <div key={s.id} className="cms-asset">
                  <button
                    type="button"
                    className="cms-asset-thumb"
                    title={picking ? "Use this image" : "Copy URL"}
                    onClick={() => pickUrl(stockFull(s.id))}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stockThumb(s.id)} alt={s.label} loading="lazy" />
                  </button>
                  <div className="cms-asset-meta">
                    <span className="truncate">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : loading ? (
            <p className="p-8 text-center text-sm text-muted">Loading…</p>
          ) : (
            (() => {
              const shown = view === "pdfs" ? uploadedPdfs : uploadedImages;
              if (shown.length === 0)
                return (
                  <p className="p-8 text-center text-sm text-muted">
                    Nothing here yet. Click <b>Upload</b> to add{" "}
                    {view === "pdfs" ? "a PDF" : "an image"}.
                  </p>
                );
              return (
                <div className="cms-grid">
                  {shown.map((a) => (
                    <div key={a.key} className="cms-asset">
                      <button
                        type="button"
                        className="cms-asset-thumb"
                        title={picking ? "Use this asset" : "Copy URL"}
                        onClick={() => pickUrl(a.url)}
                      >
                        {a.kind === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.url} alt={a.key} loading="lazy" />
                        ) : (
                          <span className="cms-asset-pdf">PDF</span>
                        )}
                      </button>
                      <div className="cms-asset-meta">
                        <span className="truncate" title={a.key}>
                          {a.key.replace(/^\d+-/, "")}
                        </span>
                        <span className="text-muted">{fmtSize(a.size)}</span>
                      </div>
                      <button
                        type="button"
                        className="cms-asset-del"
                        title="Delete"
                        onClick={() => onDelete(a.key)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>

        <div className="cms-modal-foot">
          {view === "stock"
            ? "Curated HD & 3D imagery — click to use. Or upload your own."
            : picking
              ? "Click an asset to use it, or upload a new one."
              : "Click to copy URL. Upload to add your own assets."}
        </div>
      </div>
    </div>
  );
}
