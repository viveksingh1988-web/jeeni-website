import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog-data";
import { getPages } from "@/lib/cms/pages";
import { getStore } from "@/lib/cms/store";

const BASE = "https://jeeniai.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const doc = await getStore().getPublished();

  const staticPaths = [
    "",
    "/what-we-do",
    "/services",
    "/blog",
    "/resources",
    "/whitepaper",
    "/contact-us",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Blog posts (CMS-aware: includes any created/removed posts).
  const posts = getPosts(doc).map((p) => ({
    url: `${BASE}/what-we-do/f/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Custom pages built with the page builder.
  const custom = getPages(doc).map((p) => ({
    url: `${BASE}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPaths, ...posts, ...custom];
}
