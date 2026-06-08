"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  pagesCount: number;
  postsCount: number;
  mediaCount: number;
  leadsCount: number;
  versionsCount: number;
  lastPublished: string | null;
  lastSaved: string | null;
  hasUnpublished: boolean;
  siteName: string;
};

export function DashboardClient({
  pagesCount,
  postsCount,
  mediaCount,
  leadsCount,
  lastPublished,
  lastSaved,
  hasUnpublished,
  siteName,
}: Props) {
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState("");

  async function handlePublish() {
    setPublishing(true);
    setPublishMsg("");
    try {
      const res = await fetch("/api/content/publish", { method: "POST" });
      if (res.ok) {
        setPublishMsg("Published successfully");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setPublishMsg("Publish failed");
      }
    } catch {
      setPublishMsg("Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  const fmt = (iso: string | null) => {
    if (!iso) return "Never";
    try {
      return new Intl.DateTimeFormat("en", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
      }).format(new Date(iso));
    } catch { return iso; }
  };

  const stats = [
    { label: "Pages", value: pagesCount, href: "/studio/dashboard/pages", color: "bg-blue-500", icon: "📄" },
    { label: "Blog Posts", value: postsCount, href: "/studio/dashboard/blog", color: "bg-violet-500", icon: "✍️" },
    { label: "Media Assets", value: mediaCount, href: "/studio/dashboard/media", color: "bg-emerald-500", icon: "🖼️" },
    { label: "Leads", value: leadsCount, href: "/studio/dashboard/leads", color: "bg-amber-500", icon: "📩" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">{siteName} CMS Dashboard</p>
      </div>

      {/* Publish status banner */}
      {hasUnpublished && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Unpublished changes</p>
              <p className="text-xs text-amber-600">Last saved {fmt(lastSaved)} · Not yet live</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {publishMsg && <span className="text-xs text-amber-700">{publishMsg}</span>}
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60 transition-colors"
            >
              {publishing ? "Publishing…" : "Publish now"}
            </button>
          </div>
        </div>
      )}

      {!hasUnpublished && lastPublished && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3">
          <svg className="h-4 w-4 text-emerald-500 flex-none" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-emerald-700">All changes published · Last published {fmt(lastPublished)}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/studio/dashboard/pages"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-blue-500 flex-none">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            New Page
          </Link>
          <Link
            href="/studio/dashboard/blog"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-violet-500 flex-none">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            New Post
          </Link>
          <a
            href="/?edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-500 flex-none">
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            </svg>
            Inline Edit
          </a>
          <Link
            href="/studio/dashboard/media"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-500 flex-none">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Upload Media
          </Link>
        </div>
      </div>

      {/* Platform info */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Platform</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
          {[
            { label: "Inline Editing", status: "Active", color: "text-emerald-600" },
            { label: "Draft/Publish Workflow", status: "Active", color: "text-emerald-600" },
            { label: "Media Library", status: "Active", color: "text-emerald-600" },
            { label: "SEO Manager", status: "Active", color: "text-emerald-600" },
            { label: "Redirects", status: "Active", color: "text-emerald-600" },
            { label: "Content History", status: "Active", color: "text-emerald-600" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-none" />
              <span className="text-slate-600">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
