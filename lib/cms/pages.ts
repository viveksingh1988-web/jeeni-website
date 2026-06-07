/* Custom pages built from blocks via the page builder. Pages are stored in the
 * "site.pages" collection (no code seed — they start empty). Each page item has
 * fields {title, slug} and a nested "blocks" collection. */

import type { SeedCollection, ContentDoc, ResolvedItem } from "./types";
import { resolveCollection } from "./merge";

export const SITE_PAGES: SeedCollection = { id: "site.pages", items: [] };

/** Library sections appended to built-in pages (home, services, …). Kept in a
 *  separate collection so they never appear as standalone custom pages. */
export const SITE_EXTRAS: SeedCollection = { id: "site.extras", items: [] };

export type ResolvedPage = {
  _id: string;
  slug: string;
  title: string;
  blocks: ResolvedItem[];
};

export function getPages(doc: ContentDoc | undefined): ResolvedPage[] {
  return resolveCollection(doc, SITE_PAGES).map((p) => ({
    _id: p._id,
    slug: p.fields.slug || p._id,
    title: p.fields.title || "Untitled",
    blocks: p.children?.blocks ?? [],
  }));
}

export function getPage(
  doc: ContentDoc | undefined,
  slug: string
): ResolvedPage | undefined {
  return getPages(doc).find((p) => p.slug === slug || p._id === slug);
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "page"
  );
}
