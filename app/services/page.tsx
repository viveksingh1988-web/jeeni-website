import type { Metadata } from "next";
import { Aurora } from "@/components/aurora";
import { Reveal } from "@/components/motion-primitives";
import { MagneticButton } from "@/components/magnetic-button";
import { FAQ } from "@/components/faq";
import { Scene } from "@/components/scene";
import { Layer } from "@/components/parallax";
import { Eyebrow, SectionShell } from "@/components/ui";
import { Editable } from "@/components/cms/editable";
import { PageExtras } from "@/components/sections/page-extras";
import { ServiceCards } from "@/components/sections/service-cards";
import { SERVICES_FAQ } from "@/lib/cms/seeds/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services — AI Business Solutions for Your Growth | Jeeni",
  description:
    "Stop guessing and start planning with an AI audit. Explore Jeeni's services: AI readiness, custom solutions, workflow automation, analytics, content, and venture advisory.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <Aurora />
        <Scene
          variant="knot"
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[520px] w-[46%] -translate-y-1/2 md:block"
        />
        <SectionShell>
          <Reveal variant="left" className="max-w-2xl">
            <Eyebrow>
              <Editable id="services.hero.eyebrow">Services</Editable>
            </Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              <Editable id="services.hero.title1">AI Business Solutions</Editable>{" "}
              <span className="text-gradient">
                <Editable id="services.hero.title2">for Your Growth</Editable>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              <Editable id="services.hero.body">
                Stop guessing and start planning with an AI audit. Most businesses
                fail at AI because they begin with tools instead of addressing
                their problems.
              </Editable>
            </p>
          </Reveal>
        </SectionShell>
      </section>

      <SectionShell className="py-10">
        <ServiceCards />
      </SectionShell>

      {/* FAQ */}
      <SectionShell className="py-16" cmsId="services.faq">
        <Reveal variant="flip" className="mx-auto mb-10 max-w-2xl text-center">
          <Eyebrow>
            <Editable id="services.faq.eyebrow">Common questions</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="services.faq.heading">How an engagement works</Editable>
          </h2>
        </Reveal>
        <Layer>
          <FAQ seed={SERVICES_FAQ} />
        </Layer>
      </SectionShell>

      {/* Closing CTA */}
      <SectionShell className="py-20" cmsId="services.cta">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-background-soft to-background px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-navy/20 blur-[100px]" />
            <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <Editable id="services.cta.heading">
                Where are you in your AI journey?
              </Editable>
            </h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              <Editable id="services.cta.body">
                If you&apos;re unsure about your AI readiness or how to conduct an
                AI audit, we can help you discover custom AI solutions.
              </Editable>
            </p>
            <div className="relative mt-9 flex justify-center">
              <MagneticButton href="/contact-us" hrefId="services.cta.button.href">
                <Editable id="services.cta.button">Schedule Now</Editable>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </SectionShell>
      <PageExtras pageKey="services" />
    </>
  );
}
