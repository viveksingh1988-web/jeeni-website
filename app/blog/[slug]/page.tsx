import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Aurora } from "@/components/aurora";
import { MagneticButton } from "@/components/magnetic-button";
import { BlogCard3D } from "@/components/blog-card-3d";
import { JsonLd } from "@/components/json-ld";
import { Editable } from "@/components/cms/editable";
import { SectionShell } from "@/components/ui";
import { PostBody } from "@/components/sections/post-body";
import { BLOG_POSTS, getPosts, getPost } from "@/lib/blog-data";
import { getStore } from "@/lib/cms/store";
import { sessionValid, SESSION_COOKIE, isAdminEmail } from "@/lib/cms/auth";
import { auth as nextAuth } from "@/auth";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return BLOG_POSTS.items.map((p) => ({ slug: p._id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(await getStore().getPublished(), slug);
  if (!post) return { title: "Article not found | Jeeni" };
  return {
    title: `${post.title} | Jeeni Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, images: post.image ? [post.image] : [], type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getStore().getPublished();
  const post = getPost(doc, slug);

  // Visitors get a 404 for unknown posts; admins get the editable shell so
  // they can edit draft-only posts before publishing (same pattern as custom pages).
  if (!post) {
    const isAdmin =
      sessionValid((await cookies()).get(SESSION_COOKIE)?.value) ||
      isAdminEmail((await nextAuth())?.user?.email);
    if (!isAdmin) notFound();
  }

  const others = post ? getPosts(doc).filter((p) => p.slug !== post.slug).slice(0, 2) : [];
  const articleSchema = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: new Date(post.date).toISOString(),
    author: { "@type": "Organization", name: post.author, url: "https://jeeniai.com" },
    publisher: { "@type": "Organization", name: "Jeeni", logo: { "@type": "ImageObject", url: "https://jeeniai.com/opengraph-image" } },
    mainEntityOfPage: `https://jeeniai.com/blog/${post.slug}`,
  } : null;

  return (
    <article>
      {articleSchema && <JsonLd data={articleSchema} />}
      <Aurora />
      <SectionShell className="max-w-4xl pt-28">
        <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back to Blog
        </Link>
      </SectionShell>

      <PostBody slug={slug} />

      <SectionShell className="max-w-3xl">
        <div className="mt-2 rounded-3xl glass p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-bold">
            <Editable id="post.cta.heading">Ready to measure your AI ROI?</Editable>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            <Editable id="post.cta.body">Let&apos;s explore what&apos;s possible for your business.</Editable>
          </p>
          <div className="mt-6 flex justify-center">
            <MagneticButton href="/contact-us" hrefId="post.cta.button.href">
              <Editable id="post.cta.button">Calculate Your ROI</Editable>
            </MagneticButton>
          </div>
        </div>
      </SectionShell>

      {post && others.length > 0 && (
        <SectionShell className="py-10">
          <h2 className="font-display text-2xl font-bold tracking-tight">More from the blog</h2>
          <div className="mt-8 grid gap-7 md:grid-cols-2">
            {others.map((p, i) => <BlogCard3D key={p.slug} post={p} index={i} />)}
          </div>
        </SectionShell>
      )}
    </article>
  );
}
