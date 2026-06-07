import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const page = getPage(await getStore().getPublished(), path);
  if (!page) return { title: "Jeeni", robots: { index: false } };
  return {
    title: `${page.title} | Jeeni`,
    alternates: { canonical: `/${path}` },
    openGraph: { title: page.title, type: "website" },
  };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join("/");
  const page = getPage(await getStore().getPublished(), path);

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
