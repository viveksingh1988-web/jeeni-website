"use client";

import { PageBlocks } from "./page-blocks";
import { SITE_EXTRAS } from "@/lib/cms/pages";

/* An "add sections from the library" area appended to a built-in page. Stored
   separately from custom pages, keyed by the page. Visible content only renders
   when sections have been added; the library palette shows in edit mode. */
export function PageExtras({ pageKey }: { pageKey: string }) {
  return (
    <section className="mx-auto max-w-7xl px-2 py-2">
      <PageBlocks pageId={`page:${pageKey}`} seed={SITE_EXTRAS} />
    </section>
  );
}
