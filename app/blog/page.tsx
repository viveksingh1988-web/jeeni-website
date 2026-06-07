import type { Metadata } from "next";
import { Aurora } from "@/components/aurora";
import { Reveal } from "@/components/motion-primitives";
import { Scene } from "@/components/scene";
import { Eyebrow, SectionShell } from "@/components/ui";
import { Editable } from "@/components/cms/editable";
import { PageExtras } from "@/components/sections/page-extras";
import { BlogList } from "@/components/sections/blog-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Insights on Measurable AI ROI | Jeeni",
  description:
    "Research-backed perspectives on turning AI capability into measurable value: the future of AI in business, maximizing ROI, and boosting collaboration.",
};

export default function BlogPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44">
        <Aurora />
        <Scene
          variant="field"
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[460px] w-[46%] -translate-y-1/2 md:block"
        />
        <SectionShell>
          <Reveal variant="flip" className="max-w-3xl">
            <Eyebrow>
              <Editable id="blog.hero.eyebrow">Blog</Editable>
            </Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              <Editable id="blog.hero.title1">Insights on</Editable>{" "}
              <span className="text-gradient">
                <Editable id="blog.hero.title2">measurable AI value</Editable>
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              <Editable id="blog.hero.body">
                Research-backed perspectives on turning AI capability into revenue,
                reclaimed time, and real ROI.
              </Editable>
            </p>
          </Reveal>
        </SectionShell>
      </section>

      <SectionShell className="py-10">
        <BlogList columns={3} />
      </SectionShell>
      <PageExtras pageKey="blog" />
    </>
  );
}
