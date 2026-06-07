import type { Metadata } from "next";
import { Aurora } from "@/components/aurora";
import { ParallaxImage } from "@/components/parallax";
import { Reveal } from "@/components/motion-primitives";
import { MagneticButton } from "@/components/magnetic-button";
import { Scene } from "@/components/scene";
import { Eyebrow, SectionShell } from "@/components/ui";
import { Editable } from "@/components/cms/editable";
import { PageExtras } from "@/components/sections/page-extras";
import { StepsList } from "@/components/sections/simple-collections";
import { WHATWEDO_STEPS } from "@/lib/cms/seeds/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What We Do — Measurable AI ROI | Jeeni",
  description:
    "We turn futurist research into measurable value. We track revenue and savings from day one for clear ROI.",
};

export default function WhatWeDoPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <Aurora />
        <Scene
          variant="rings"
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[520px] w-[46%] -translate-y-1/2 md:block"
        />
        <SectionShell>
          <Reveal className="max-w-3xl">
            <Eyebrow>
              <Editable id="whatwedo.hero.eyebrow">What we do</Editable>
            </Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              <Editable id="whatwedo.hero.title1">
                We turn futurist research into
              </Editable>{" "}
              <span className="text-gradient">
                <Editable id="whatwedo.hero.title2">measurable value.</Editable>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              <Editable id="whatwedo.hero.body">
                We track revenue and savings from day one for clear ROI.
              </Editable>
            </p>
            <div className="mt-9">
              <MagneticButton href="/contact-us" hrefId="whatwedo.hero.cta.href">
                <Editable id="whatwedo.hero.cta">Calculate Your ROI</Editable>
              </MagneticButton>
            </div>
          </Reveal>
        </SectionShell>
      </section>

      {/* Approach with image */}
      <SectionShell className="py-16" cmsId="whatwedo.approach">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal variant="left">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1100&q=80"
              editId="whatwedo.approach.image"
              alt="ROI analytics dashboard"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="aspect-[4/3] rounded-3xl border border-slate-200 card-shadow"
            />
          </Reveal>

          <Reveal variant="right" delay={0.15}>
            <Eyebrow>
              <Editable id="whatwedo.approach.eyebrow">Our Approach</Editable>
            </Eyebrow>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              <Editable id="whatwedo.approach.heading1">Rooted in Insight,</Editable>{" "}
              <span className="text-gradient">
                <Editable id="whatwedo.approach.heading2">Powered by Research</Editable>
              </span>
            </h2>
            <Editable as="p" id="whatwedo.approach.body" className="mt-6 text-lg leading-relaxed text-foreground/90">
              At Jeeni, we don&apos;t just explore what AI can do. We measure what
              it costs to do it—and what the return actually looks like.
            </Editable>
            <div className="mt-6 border-l-2 border-blue/60 pl-6">
              <Editable as="p" id="whatwedo.approach.quote" className="font-display text-xl font-semibold leading-snug">
                Stop asking what AI can do. Start asking what it costs—and what it
                earns.
              </Editable>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* How we deliver ROI — process */}
      <SectionShell className="py-16" cmsId="whatwedo.steps">
        <Reveal variant="flip" className="max-w-2xl">
          <Eyebrow>
            <Editable id="whatwedo.steps.eyebrow">How We Deliver ROI</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="whatwedo.steps.heading">
              From research to a number on your P&amp;L
            </Editable>
          </h2>
        </Reveal>

        <StepsList seed={WHATWEDO_STEPS} />
      </SectionShell>

      {/* Featured */}
      <SectionShell className="py-16" cmsId="whatwedo.featured">
        <Reveal>
          <div className="glass rounded-[2.5rem] p-10 sm:p-14">
            <Eyebrow>
              <Editable id="whatwedo.featured.eyebrow">
                What&apos;s New · Davos 2026
              </Editable>
            </Eyebrow>
            <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              <Editable id="whatwedo.featured.heading">
                Stop Asking What Can AI Do?
              </Editable>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              <Editable id="whatwedo.featured.body">
                Start asking What does it cost and what will it earn? Jeeni&apos;s
                research reveals the real ROI playbook from global business
                leaders at Davos 2026.
              </Editable>
            </p>
            <div className="mt-8">
              <MagneticButton href="/whitepaper" hrefId="whatwedo.featured.cta.href">
                <Editable id="whatwedo.featured.cta">Get Strategic Insights</Editable>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </SectionShell>

      {/* Final CTA */}
      <SectionShell className="py-20" cmsId="whatwedo.cta">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-background-soft to-background px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[100px]" />
            <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
              <Editable id="whatwedo.cta.heading1">Ready to Accelerate Your</Editable>{" "}
              <span className="text-gradient">
                <Editable id="whatwedo.cta.heading2">AI Success?</Editable>
              </span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              <Editable id="whatwedo.cta.body">
                A genuine conversation about your AI opportunities. We&apos;ll
                explore what&apos;s possible, what makes sense for your business,
                and how to move forward with confidence.
              </Editable>
            </p>
            <div className="relative mt-9 flex justify-center">
              <MagneticButton href="/whitepaper" hrefId="whatwedo.cta.button.href">
                <Editable id="whatwedo.cta.button">Explore Your ROI Potential</Editable>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </SectionShell>
      <PageExtras pageKey="whatwedo" />
    </>
  );
}
