"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCMS } from "./edit-context";
import { SITE_PAGES, slugify } from "@/lib/cms/pages";
import { BLOG_POSTS } from "@/lib/blog-data";
import { NAV_LINKS } from "@/lib/cms/seeds/nav";
import { FOOTER_ACTIONS } from "@/lib/cms/seeds/footer";

const LOC = { kind: "top", id: SITE_PAGES.id } as const;
const NAV_LOC = { kind: "top", id: NAV_LINKS.id } as const;
const FOOTER_LOC = { kind: "top", id: FOOTER_ACTIONS.id } as const;

/** Built-in site pages that can act as parents for nested custom pages. */
const BUILT_IN = [
  { title: "Home", slug: "" },
  { title: "Services", slug: "services" },
  { title: "What We Do", slug: "what-we-do" },
  { title: "Blog", slug: "blog" },
  { title: "Resources", slug: "resources" },
  { title: "Whitepaper", slug: "whitepaper" },
  { title: "Contact Us", slug: "contact-us" },
];

const BLOG_STARTER = [
  { type: "h2", text: "Introduction" },
  { type: "p", text: "Start your article here." },
];

export function PagesManager() {
  const cms = useCMS();
  const router = useRouter();
  const open = !!cms?.pagesOpen;

  const [tab, setTab] = useState<"page" | "blog">("page");

  // Page form
  const [pageTitle, setPageTitle] = useState("");
  const [parent, setParent] = useState("");
  const [inHeader, setInHeader] = useState(false);
  const [inFooter, setInFooter] = useState(false);

  // Blog form
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("Insights");

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cms?.closePages();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cms]);

  if (!cms || !open) return null;

  const customPages = cms.resolve(SITE_PAGES);
  const pageIds = customPages.map((p) => p._id);
  const blogPosts = cms.resolve(BLOG_POSTS);
  const blogIds = blogPosts.map((p) => p._id);

  // All possible parents: built-ins + existing custom pages
  const allParents = [
    ...BUILT_IN,
    ...customPages.map((p) => ({ title: p.fields.title || p._id, slug: p.fields.slug || p._id })),
  ];

  function addToNav(label: string, href: string) {
    if (!cms) return;
    const ids = cms.resolve(NAV_LINKS).map((i) => i._id);
    cms.addItem(NAV_LOC, ids, { label, href });
  }
  function addToFooterList(label: string, href: string) {
    if (!cms) return;
    const ids = cms.resolve(FOOTER_ACTIONS).map((i) => i._id);
    cms.addItem(FOOTER_LOC, ids, { label, href });
  }

  async function createPage() {
    if (!cms || !pageTitle.trim() || busy) return;
    setBusy(true);
    try {
      const id = await cms.createPage(pageIds, pageTitle.trim(), slugify(pageTitle), parent);
      const pageHref = `/${id}`;
      if (inHeader) addToNav(pageTitle.trim(), pageHref);
      if (inFooter) addToFooterList(pageTitle.trim(), pageHref);
      setPageTitle(""); setParent(""); setInHeader(false); setInFooter(false);
      cms.closePages();
      // ?edit preserves edit mode on the new page so the draft loads immediately.
      router.push(`${pageHref}?edit`);
    } finally { setBusy(false); }
  }

  async function createBlog() {
    if (!cms || !blogTitle.trim() || busy) return;
    setBusy(true);
    try {
      const id = await cms.createPost(blogIds, {
        title: blogTitle.trim(),
        excerpt: "A short summary of this article.",
        category: blogCategory || "Insights",
        author: "Jeeni",
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
      }, BLOG_STARTER);
      setBlogTitle(""); setBlogCategory("Insights");
      cms.closePages();
      router.push(`/blog/${id}?edit`);
    } finally { setBusy(false); }
  }

  const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue/60";

  const pageSlug = pageTitle.trim() ? `/${parent ? `${parent}/` : ""}${slugify(pageTitle)}` : null;

  return (
    <div className="cms-modal-backdrop" onClick={() => cms.closePages()}>
      <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cms-modal-head">
          <h2 className="text-lg font-bold">Pages & Blog</h2>
          <button type="button" className="cms-btn-ghost" onClick={() => cms.closePages()}>✕</button>
        </div>

        <div className="cms-modal-body">
          {/* ── Create new ── */}
          <div className="mb-5 rounded-2xl border border-slate-200 p-4">
            {/* Type tabs */}
            <div className="mb-4 flex gap-1 rounded-xl bg-surface-muted p-1">
              {(["page", "blog"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition ${tab === t ? "bg-white shadow text-foreground" : "text-muted hover:text-foreground"}`}
                >
                  {t === "page" ? "📄 Page" : "✍️ Blog post"}
                </button>
              ))}
            </div>

            {tab === "page" ? (
              /* ── Page form ── */
              <div className="flex flex-col gap-3">
                <input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createPage()}
                  placeholder="Page title" className={inputCls} autoFocus />

                <label className="flex items-center gap-2 text-sm text-muted">
                  Location:
                  <select value={parent} onChange={(e) => setParent(e.target.value)} className={`${inputCls} flex-1`}>
                    <option value="">Site root  (/page-name)</option>
                    {allParents.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        Under: {p.title}  (/{p.slug ? `${p.slug}/` : ""})
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" checked={inHeader} onChange={(e) => setInHeader(e.target.checked)} />
                    Add to header menu
                  </label>
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" checked={inFooter} onChange={(e) => setInFooter(e.target.checked)} />
                    Add to footer
                  </label>
                  <button type="button" className="cms-btn-primary ml-auto"
                    disabled={!pageTitle.trim() || busy} onClick={createPage}>
                    {busy ? "Creating…" : "＋ Create page"}
                  </button>
                </div>
                {pageSlug && <p className="text-xs text-muted">URL: <code>{pageSlug}</code></p>}
              </div>
            ) : (
              /* ── Blog form ── */
              <div className="flex flex-col gap-3">
                <input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createBlog()}
                  placeholder="Post title" className={inputCls} autoFocus />
                <input value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)}
                  placeholder="Category (e.g. AI Strategy)" className={inputCls} />
                <p className="text-xs text-muted">
                  Blog posts live at <code>/blog/post-slug</code> alongside all other posts.
                </p>
                <button type="button" className="cms-btn-primary self-end"
                  disabled={!blogTitle.trim() || busy} onClick={createBlog}>
                  {busy ? "Creating…" : "＋ Create blog post"}
                </button>
              </div>
            )}
          </div>

          {/* ── Existing custom pages ── */}
          {customPages.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Custom pages</p>
              <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                {customPages.map((p) => {
                  const path = p.fields.slug || p._id;
                  return (
                    <li key={p._id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{p.fields.title || "Untitled"}</p>
                        <p className="text-xs text-muted">/{path}</p>
                      </div>
                      <div className="flex flex-none gap-2">
                        <button type="button" className="cms-btn-primary text-xs px-3"
                          onClick={() => { cms.closePages(); router.push(`/${path}`); }}>
                          Open
                        </button>
                        <button type="button" className="cms-asset-del !static" title="Delete"
                          onClick={() => { if (window.confirm(`Delete "${p.fields.title}"?`)) cms.removeItem(LOC, pageIds, p._id, false); }}>
                          ✕
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ── Existing blog posts ── */}
          {blogPosts.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Blog posts</p>
              <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                {blogPosts.map((p) => (
                  <li key={p._id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{p.fields.title || "Untitled"}</p>
                      <p className="text-xs text-muted">/blog/{p._id}</p>
                    </div>
                    <div className="flex flex-none gap-2">
                      <button type="button" className="cms-btn-primary text-xs px-3"
                        onClick={() => { cms.closePages(); router.push(`/blog/${p._id}`); }}>
                        Open
                      </button>
                      <button type="button" className="cms-asset-del !static" title="Delete"
                        onClick={() => {
                          const BLOG_LOC = { kind: "top", id: BLOG_POSTS.id } as const;
                          if (window.confirm(`Delete "${p.fields.title}"?`))
                            cms.removeItem(BLOG_LOC, blogIds, p._id, p.seed);
                        }}>
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="cms-modal-foot">New pages & posts are auto-saved. Click Open to edit, then Publish to go live.</div>
      </div>
    </div>
  );
}
