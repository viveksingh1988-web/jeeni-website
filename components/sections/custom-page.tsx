"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCMS } from "@/components/cms/edit-context";
import { SITE_PAGES } from "@/lib/cms/pages";
import { PageBlocks } from "./page-blocks";
import { resolveCollection } from "@/lib/cms/merge";

export function CustomPage({ slug }: { slug: string }) {
  const cms = useCMS();
  const pages = cms
    ? cms.resolve(SITE_PAGES)
    : resolveCollection(undefined, SITE_PAGES);
  const page = pages.find((p) => (p.fields.slug || p._id) === slug);

  const isAdmin = cms?.isAdmin;
  const editMode = cms?.editMode;
  const draftLoading = cms?.draftLoading;
  const enterEdit = cms?.enterEdit;

  // Always keep a ref to the latest cms so effects never hold a stale closure.
  const cmsRef = useRef(cms);
  cmsRef.current = cms;

  // Admins landing on a draft-only page (not yet published) auto-enter edit
  // mode so the page loads from the draft instead of showing "not found".
  useEffect(() => {
    if (!page && isAdmin && !editMode && !draftLoading) {
      enterEdit?.();
    }
  }, [page, isAdmin, editMode, draftLoading, enterEdit]);

  // If the page is missing from the draft after it finishes loading (e.g. the
  // draft lost site.pages due to an earlier bug), auto-seed a fresh copy so the
  // admin can immediately start adding blocks. Runs once per mount.
  const [seedingPage, setSeedingPage] = useState(false);
  const autoCreateRef = useRef(false);
  useEffect(() => {
    if (!page && isAdmin && editMode && !draftLoading && !autoCreateRef.current) {
      autoCreateRef.current = true;
      setSeedingPage(true);
      const c = cmsRef.current;
      if (!c) { setSeedingPage(false); return; }
      const leaf = slug.split("/").pop() || slug;
      const parent = slug.split("/").slice(0, -1).join("/");
      c.createPage([], leaf, leaf, parent)
        .catch(() => {})
        .finally(() => setSeedingPage(false));
    }
  }, [page, isAdmin, editMode, draftLoading, slug]);

  if (!page) {
    // While the editor draft is still loading or the page is being auto-seeded,
    // don’t flash "not found".
    if (cms?.isAdmin && (cms.draftLoading || !cms.editMode || seedingPage)) {
      return (
        <div className="grid min-h-[60vh] place-items-center px-6 pt-32 text-center text-muted">
          Loading your draft…
        </div>
      );
    }
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 pt-32 text-center">
        {cms?.editMode ? (
          <div className="max-w-md">
            <h1 className="font-display text-2xl font-bold">Page not found in draft</h1>
            <p className="mt-3 text-muted">
              Create it from <b>📄 Pages</b> in the toolbar, then Publish.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="font-display text-4xl font-extrabold">Page not found</h1>
            <p className="mt-3 text-muted">This page doesn’t exist (yet).</p>
          </div>
        )}
      </div>
    );
  }

  // Breadcrumbs from the path segments (linking to any real ancestor pages).
  const segs = slug.split("/");
  const crumbs = segs.map((_, i) => {
    const path = segs.slice(0, i + 1).join("/");
    const anc = pages.find((p) => (p.fields.slug || p._id) === path);
    return { path, title: anc?.fields.title || segs[i] };
  });

  return (
    <article className="pt-28 pb-10">
      <h1 className="sr-only">{page.fields.title || "Page"}</h1>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-3xl px-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {i === crumbs.length - 1 ? (
                <span className="text-foreground">{c.title}</span>
              ) : (
                <Link href={`/${c.path}`} className="hover:text-foreground">{c.title}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <PageBlocks pageId={page._id} />
    </article>
  );
}
