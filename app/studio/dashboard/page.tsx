import { getStore } from "@/lib/cms/store";
import { getPages } from "@/lib/cms/pages";
import { resolveCollection } from "@/lib/cms/merge";
import { BLOG_POSTS } from "@/lib/blog-data";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const store = getStore();
  const [draft, published, media, leads, versions] = await Promise.all([
    store.getDraft(),
    store.getPublished(),
    store.listMedia(),
    store.listLeads(),
    store.listVersions(),
  ]);

  const pages = getPages(draft);
  const posts = resolveCollection(draft, BLOG_POSTS);

  const hasUnpublished = draft.updatedAt !== published.updatedAt && !!draft.updatedAt;

  return (
    <DashboardClient
      pagesCount={pages.length}
      postsCount={posts.length}
      mediaCount={media.length}
      leadsCount={leads.length}
      versionsCount={versions.length}
      lastPublished={published.updatedAt || null}
      lastSaved={draft.updatedAt || null}
      hasUnpublished={hasUnpublished}
      siteName={draft.settings?.siteName || "Jeeni"}
    />
  );
}
