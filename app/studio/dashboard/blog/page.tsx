"use client";

import { useEffect, useState } from "react";

type Post = { id: string; title: string; date: string; author: string; excerpt: string };

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", author: "Jeeni Team" });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (res.ok) {
        const doc = await res.json();
        const coll = doc.collections?.["blog.posts"];
        if (coll?.order && coll?.items) {
          const list: Post[] = coll.order
            .filter((id: string) => coll.items[id])
            .map((id: string) => ({
              id,
              title: coll.items[id].fields?.title || "Untitled",
              date: coll.items[id].fields?.date || "",
              author: coll.items[id].fields?.author || "Jeeni Team",
              excerpt: coll.items[id].fields?.excerpt || "",
            }));
          setPosts(list);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createPost() {
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/content?draft=1");
      if (!res.ok) throw new Error();
      const doc = await res.json();
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const id = `c_${Date.now().toString(36)}`;
      const today = new Date().toISOString().split("T")[0];
      const coll = doc.collections?.["blog.posts"] || { order: [], items: {} };
      coll.items[id] = {
        _id: id,
        fields: {
          title: form.title.trim(),
          slug,
          excerpt: form.excerpt.trim(),
          author: form.author.trim() || "Jeeni Team",
          date: today,
          category: "Insights",
          readTime: "5 min read",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        },
        children: {
          blocks: {
            order: ["b0", "b1"],
            items: {
              b0: { _id: "b0", fields: { type: "heading", text: form.title.trim() } },
              b1: { _id: "b1", fields: { type: "paragraph", text: form.excerpt.trim() || "Start writing your post here." } },
            },
          },
        },
      };
      if (!coll.order.includes(id)) coll.order.unshift(id);
      doc.collections = { ...(doc.collections || {}), "blog.posts": coll };
      const saveRes = await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(doc),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      setMsg("Post created — open Edit Mode at /blog/" + slug + " to edit content");
      setTimeout(() => setMsg(""), 5000);
      setForm({ title: "", excerpt: "", author: "Jeeni Team" });
      setShowForm(false);
      await load();
    } catch (e) {
      setMsg("Error: " + String(e));
    } finally {
      setCreating(false);
    }
  }

  async function deletePost(postId: string) {
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(postId);
    try {
      const res = await fetch("/api/content?draft=1");
      if (!res.ok) throw new Error();
      const doc = await res.json();
      const coll = doc.collections?.["blog.posts"];
      if (coll) {
        coll.order = coll.order.filter((id: string) => id !== postId);
        if (!coll.removedSeeds) coll.removedSeeds = [];
        if (!coll.removedSeeds.includes(postId)) coll.removedSeeds.push(postId);
        delete coll.items[postId];
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

  const fmt = (d: string) => {
    if (!d) return "";
    try { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d)); }
    catch { return d; }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage all blog posts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + New Post
        </button>
      </div>

      {msg && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{msg}</div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">New Blog Post</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Title *</label>
              <input
                autoFocus
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Post title"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short summary for blog listing…"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Author name"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={createPost}
                disabled={creating || !form.title.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {creating ? "Creating…" : "Create Post"}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm({ title: "", excerpt: "", author: "Jeeni Team" }); }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">Loading…</div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No blog posts yet.</p>
          <button onClick={() => setShowForm(true)} className="mt-2 text-sm font-semibold text-blue-600 hover:underline">
            Create your first post →
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className={`flex items-center justify-between px-5 py-4 ${i < posts.length - 1 ? "border-b border-slate-50" : ""}`}
            >
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-sm font-semibold text-slate-800 truncate">{post.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {post.author} · {fmt(post.date)}
                  {post.excerpt && <span className="ml-2 text-slate-300">— {post.excerpt.slice(0, 60)}{post.excerpt.length > 60 ? "…" : ""}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-none">
                <a
                  href={`/blog/${post.id}?edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Edit ↗
                </a>
                <button
                  onClick={() => deletePost(post.id)}
                  disabled={deleting === post.id}
                  className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {deleting === post.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
