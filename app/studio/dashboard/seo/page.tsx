"use client";

import { useEffect, useState } from "react";

type SEOEntry = {
  pageId: string;
  label: string;
  path: string;
  title: string;
  description: string;
  ogImage: string;
  noIndex: boolean;
};

const PAGES = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "what-we-do", label: "What We Do", path: "/what-we-do" },
  { id: "blog", label: "Blog", path: "/blog" },
  { id: "resources", label: "Resources", path: "/resources" },
  { id: "whitepaper", label: "Whitepaper", path: "/whitepaper" },
  { id: "contact-us", label: "Contact Us", path: "/contact-us" },
];

export default function SEOPage() {
  const [entries, setEntries] = useState<SEOEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SEOEntry, "pageId" | "label" | "path">>({ title: "", description: "", ogImage: "", noIndex: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (res.ok) {
        const doc = await res.json();
        const seoMap = doc.seo || {};
        const customPages = Object.values(doc.collections?.["site.pages"]?.items || {}).map((item: unknown) => {
          const p = item as { _id: string; fields: { title?: string; slug?: string } };
          return { id: p._id, label: p.fields?.title || p._id, path: "/" + (p.fields?.slug || p._id) };
        });
        const allPages = [...PAGES, ...customPages];
        setEntries(allPages.map((p) => ({
          pageId: p.id,
          label: p.label,
          path: p.path,
          title: seoMap[p.id]?.title || "",
          description: seoMap[p.id]?.description || "",
          ogImage: seoMap[p.id]?.ogImage || "",
          noIndex: seoMap[p.id]?.noIndex || false,
        })));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(entry: SEOEntry) {
    setEditing(entry.pageId);
    setForm({ title: entry.title, description: entry.description, ogImage: entry.ogImage, noIndex: entry.noIndex });
  }

  async function saveEntry() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (!res.ok) throw new Error();
      const doc = await res.json();
      doc.seo = { ...(doc.seo || {}), [editing]: { title: form.title, description: form.description, ogImage: form.ogImage, noIndex: form.noIndex } };
      const saveRes = await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(doc),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      setMsg("SEO data saved");
      setTimeout(() => setMsg(""), 3000);
      setEditing(null);
      await load();
    } catch (e) {
      setMsg("Error: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">SEO Manager</h1>
        <p className="mt-1 text-sm text-slate-500">Set per-page meta titles, descriptions, and Open Graph images</p>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</div>
      )}

      <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <strong>Tip:</strong> Publish after saving SEO changes to make them live on the site.
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.pageId} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              {editing === entry.pageId ? (
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800">{entry.label}</span>
                      <span className="ml-2 text-xs text-slate-400">{entry.path}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Meta Title</label>
                      <input
                        autoFocus
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Page title for search engines (50–60 chars ideal)"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                      <p className="mt-1 text-xs text-slate-400">{form.title.length}/60 characters</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Meta Description</label>
                      <textarea
                        rows={2}
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Brief page description for search results (150–160 chars ideal)"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                      />
                      <p className="mt-1 text-xs text-slate-400">{form.description.length}/160 characters</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">OG Image URL</label>
                      <input
                        type="text"
                        value={form.ogImage}
                        onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))}
                        placeholder="https://… (1200×630 ideal)"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.noIndex}
                        onChange={(e) => setForm((f) => ({ ...f, noIndex: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-600">No-index (hide from search engines)</span>
                    </label>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={saveEntry}
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {saving ? "Saving…" : "Save SEO"}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{entry.label}</span>
                      <span className="text-xs text-slate-400">{entry.path}</span>
                    </div>
                    {entry.title ? (
                      <p className="mt-0.5 text-xs text-slate-500 truncate">
                        <span className="font-medium text-slate-600">{entry.title}</span>
                        {entry.description && <span> — {entry.description.slice(0, 80)}{entry.description.length > 80 ? "…" : ""}</span>}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-slate-400 italic">No SEO data set — using site defaults</p>
                    )}
                  </div>
                  <div className="ml-4 flex items-center gap-2 flex-none">
                    {entry.noIndex && (
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-600">No-index</span>
                    )}
                    <button
                      onClick={() => startEdit(entry)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
