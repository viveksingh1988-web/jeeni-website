import type { Metadata } from "next";
import { Aurora } from "@/components/aurora";
import { Reveal } from "@/components/motion-primitives";
import { MagneticButton } from "@/components/magnetic-button";
import { Scene } from "@/components/scene";
import { Layer } from "@/components/parallax";
import { Eyebrow, SectionShell } from "@/components/ui";
import { Editable } from "@/components/cms/editable";
import { PageExtras } from "@/components/sections/page-extras";
import {
  EditablePdfButton,
  EditablePdfCardTrigger,
  EditablePdfReader,
} from "@/components/cms/editable-pdf";
import { EditableImage } from "@/components/cms/editable-image";
import { StatsRow } from "@/components/sections/simple-collections";
import { RESOURCES_STATS } from "@/lib/cms/seeds/pages";

export const dynamic = "force-dynamic";

const POV = "/Jeeni_AI_ROI_Point_of_View.pdf";
const POV_TITLE = "Jeeni — AI ROI Point of View";

export const metadata: Metadata = {
  title: "Resources — Point of View on AI ROI | Jeeni",
  description:
    "What does AI cost, and what will it earn? Read Jeeni's executive point of view on the true cost of AI adoption.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <Aurora />
        <Scene
          variant="prism"
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[520px] w-[46%] -translate-y-1/2 md:block"
        />
        <SectionShell>
          <Reveal variant="blur" className="max-w-3xl">
            <Eyebrow>
              <Editable id="resources.hero.eyebrow">Point of View</Editable>
            </Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              <Editable id="resources.hero.title1">What does AI cost, and</Editable>{" "}
              <span className="text-gradient">
                <Editable id="resources.hero.title2">what will it earn?</Editable>
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              <Editable id="resources.hero.body">
                The central question every business leader must answer—backed by
                research from global leaders at Davos 2026.
              </Editable>
            </p>
          </Reveal>
        </SectionShell>
      </section>

      {/* Executive summary + download card */}
      <SectionShell className="py-10">
        <div className="grid gap-8 lg:grid-cols-5">
          <Reveal variant="left" className="lg:col-span-3">
            <div className="glass h-full rounded-3xl p-8 sm:p-10">
              <Editable as="h2" id="resources.summary.heading" className="font-display text-2xl font-bold">
                Executive Summary
              </Editable>
              <Editable as="p" id="resources.summary.p1" className="mt-5 text-lg leading-relaxed text-foreground/90">
                The artificial intelligence revolution isn&apos;t coming—it&apos;s
                here, reshaping global economics, infrastructure demands, and
                competitive dynamics at unprecedented speed.
              </Editable>
              <Editable as="p" id="resources.summary.p2" className="mt-5 leading-relaxed text-muted">
                Our point of view cuts through the hype to the only questions that
                matter for the boardroom: what does AI cost, and what will it earn?
                Inside, we lay out the ROI playbook the world&apos;s leading
                organizations are using right now.
              </Editable>
            </div>
          </Reveal>

          <Reveal variant="right" delay={0.15} className="lg:col-span-2">
            <div className="glow-ring relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200">
              <EditablePdfCardTrigger
                id="resources.pdf.src"
                src={POV}
                title={POV_TITLE}
                className="group relative block h-44 overflow-hidden"
              >
                <EditableImage
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
                  alt="AI ROI report"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  bind={{ scalarId: "resources.pdf.image" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </EditablePdfCardTrigger>
              <div className="flex flex-1 flex-col p-7">
                <Editable as="p" id="resources.pdf.label" className="text-xs font-semibold uppercase tracking-widest text-blue">
                  Point of View · PDF
                </Editable>
                <Editable as="h3" id="resources.pdf.title" className="mt-2 font-display text-xl font-semibold leading-snug">
                  Jeeni — AI ROI Point of View
                </Editable>
                <Editable as="p" id="resources.pdf.sub" className="mt-2 text-sm text-muted">
                  The True Cost of AI Adoption · Davos 2026
                </Editable>
                <div className="mt-auto pt-6">
                  <EditablePdfButton id="resources.pdf.src" src={POV} title={POV_TITLE}>
                    Read the Point of View
                  </EditablePdfButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* Stat band */}
      <SectionShell className="py-16" cmsId="resources.stats">
        <StatsRow seed={RESOURCES_STATS} />
      </SectionShell>

      {/* INLINE READER */}
      <SectionShell id="read" className="scroll-mt-28 py-10">
        <Reveal variant="flip" className="mb-6 max-w-2xl">
          <Eyebrow>
            <Editable id="resources.reader.eyebrow">Read it here</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="resources.reader.heading">
              The Point of View, right on the page
            </Editable>
          </h2>
        </Reveal>
        <Layer>
          <EditablePdfReader id="resources.pdf.src" src={POV} title={POV_TITLE} />
        </Layer>
      </SectionShell>

      {/* CTA */}
      <SectionShell className="py-16" cmsId="resources.cta">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-background-soft to-background px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-bright/20 blur-[100px]" />
            <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <Editable id="resources.cta.heading1">Turn the research into your</Editable>{" "}
              <span className="text-gradient">
                <Editable id="resources.cta.heading2">ROI playbook</Editable>
              </span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              <Editable id="resources.cta.body">
                Let&apos;s explore what&apos;s possible for your business and how to
                move forward with confidence.
              </Editable>
            </p>
            <div className="relative mt-9 flex justify-center">
              <MagneticButton href="/whitepaper" hrefId="resources.cta.button.href">
                <Editable id="resources.cta.button">Explore Your ROI Potential</Editable>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </SectionShell>
      <PageExtras pageKey="resources" />
    </>
  );
}
