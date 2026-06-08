"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Page = { id: string; title: string; slug: string; isBuiltIn?: boolean };

const BUILT_IN: Page[] = [
  { id: "home", title: "Home", slug: "/", isBuiltIn: true },
  { id: "services", title: "Services", slug: "/services", isBuiltIn: true },
  { id: "what-we-do", title: "What We Do", slug: "/what-we-do", isBuiltIn: true },
  { id: "blog", title: "Blog", slug: "/blog", isBuiltIn: true },
  { id: "resources", title: "Resources", slug: "/resources", isBuiltIn: true },
  { id: "whitepaper", title: "Whitepaper", slug: "/whitepaper", isBuiltIn: true },
  { id: "contact-us", title: "Contact Us", slug: "/contact-us", isBuiltIn: true },
];

export default function PagesPage() {
  const [customPages, setCustomPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (res.ok) {
        const doc = await res.json();
        const coll = doc.collections?.["site.pages"];
        if (coll?.order && coll?.items) {
          const pages: Page[] = coll.order
            .filter((id: string) => coll.items[id])
            .map((id: string) => ({
              id,
              title: coll.items[id].fields?.title || id,
              slug: "/" + (coll.items[id].fields?.slug || id),
            }));
          setCustomPages(pages);
        } else {
          setCustomPages([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createPage() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (!res.ok) throw new Error("Failed to load draft");
      const doc = await res.json();
      const slug = newTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const coll = doc.collections?.["site.pages"] || { order: [], items: {} };
      const id = slug || `page-${Date.now()}`;
      coll.items[id] = {
        _id: id,
        fields: { title: newTitle.trim(), slug: id, parent: "" },
        children: {
          blocks: {
            order: ["b0"],
            items: { b0: { _id: "b0", fields: { type: "heading", title: newTitle.trim(), subtitle: "Add your content here." } } },
          },
        },
      };
      if (!coll.order.includes(id)) coll.order.push(id);
      doc.collections = { ...(doc.collections || {}), "site.pages": coll };
      const saveRes = await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(doc),
      });
      if (!saveRes.ok) throw new Error("Failed to save");
      setMsg("Page created — open in Edit Mode to add content");
      setTimeout(() => setMsg(""), 4000);
      setNewTitle("");
      setShowForm(false);
      await load();
    } catch (e) {
      setMsg("Error: " + String(e));
    } finally {
      setCreating(false);
    }
  }

  async function deletePage(pageId: string) {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    setDeleting(pageId);
    try {
      const res = await fetch("/api/content?draft=1");
      if (!res.ok) throw new Error();
      const doc = await res.json();
      const coll = doc.collections?.["site.pages"];
      if (coll) {
        coll.order = coll.order.filter((id: string) => id !== pageId);
        delete coll.items[pageId];
      }
      await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(doc),
      });
      await load();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pages</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all site pages — built-in and custom</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + New Page
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{msg}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-800">Create New Page</h3>
          <div className="flex gap-3">
            <input
              autoFocus
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createPage()}
              placeholder="Page title (e.g. About Us)"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={createPage}
              disabled={creating || !newTitle.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {creating ? "Creating…" : "Create"}
            </button>
            <button
              onClick={() => { setShowForm(false); setNewTitle(""); }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Built-in pages */}
      <div className="mb-6">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Built-in Pages</h2>
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {BUILT_IN.map((page, i) => (
            <div
              key={page.id}
              className={`flex items-center justify-between px-5 py-3.5 ${i < BUILT_IN.length - 1 ? "border-b border-slate-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  {page.title[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{page.title}</p>
                  <p className="text-xs text-slate-400">{page.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">Built-in</span>
                <a
                  href={`${page.slug}?edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Edit ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom pages */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Custom Pages {customPages.length > 0 && `(${customPages.length})`}
        </h2>
        {loading ? (
          <div className="rounded-xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
        ) : customPages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">No custom pages yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-2 text-sm font-semibold text-blue-600 hover:underline">
              Create your first page →
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            {customPages.map((page, i) => (
              <div
                key={page.id}
                className={`flex items-center justify-between px-5 py-3.5 ${i < customPages.length - 1 ? "border-b border-slate-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-500">
                    {page.title[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{page.title}</p>
                    <p className="text-xs text-slate-400">{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">Custom</span>
                  <a
                    href={`${page.slug}?edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Edit ↗
                  </a>
                  <button
                    onClick={() => deletePage(page.id)}
                    disabled={deleting === page.id}
                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {deleting === page.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
