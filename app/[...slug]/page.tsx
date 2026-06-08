import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CustomPage } from "@/components/sections/custom-page";
import { JsonLd } from "@/components/json-ld";
import { getPage } from "@/lib/cms/pages";
import { getStore } from "@/lib/cms/store";
import { sessionValid, SESSION_COOKIE, isAdminEmail } from "@/lib/cms/auth";
import { auth as nextAuth } from "@/auth";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const BASE = "https://jeeniai.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const published = await getStore().getPublished();
  const page = getPage(published, path);
  if (!page) return { title: "Jeeni", robots: { index: false } };
  const seo = published.seo?.[path] ?? published.seo?.[slug[slug.length - 1]];
  return {
    title: seo?.title ? `${seo.title} | Jeeni` : `${page.title} | Jeeni`,
    description: seo?.description,
    alternates: { canonical: seo?.canonicalUrl || `/${path}` },
    robots: seo?.noIndex ? { index: false } : undefined,
    openGraph: {
      title: seo?.title || page.title,
      description: seo?.description,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
      type: "website",
    },
  };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join("/");
  const store = getStore();
  const published = await store.getPublished();

  // Check CMS redirects before resolving the page.
  const incomingPath = "/" + path;
  for (const r of published.redirects ?? []) {
    if (r.enabled && r.from === incomingPath) {
      redirect(r.to);
    }
  }

  const page = getPage(published, path);

  // Visitors get a real 404 for unknown paths; admins get the editable shell
  // so they can build/edit draft-only pages before publishing.
  if (!page) {
    const isAdmin =
      sessionValid((await cookies()).get(SESSION_COOKIE)?.value) ||
      isAdminEmail((await nextAuth())?.user?.email);
    if (!isAdmin) notFound();
  }

  const breadcrumb = page && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      ...slug.map((seg, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: i === slug.length - 1 ? page.title : seg,
        item: `${BASE}/${slug.slice(0, i + 1).join("/")}`,
      })),
    ],
  };

  return (
    <>
      {breadcrumb && <JsonLd data={breadcrumb} />}
      <CustomPage slug={path} />
    </>
  );
}
