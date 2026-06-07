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
import { StatsRow, InsideList } from "@/components/sections/simple-collections";
import { WHITEPAPER_FINDINGS, WHITEPAPER_INSIDE } from "@/lib/cms/seeds/pages";

export const dynamic = "force-dynamic";

const PDF = "/True_Cost_of_AI_Adoption_Davos_2026.pdf";
const PDF_TITLE = "The True Cost of AI Adoption · Davos 2026";

export const metadata: Metadata = {
  title: "Whitepaper — The True Cost of AI Adoption · Davos 2026 | Jeeni",
  description:
    "AI adoption cost of AI — the Jeeni whitepaper. What does AI cost, and what will it earn? The ROI playbook from global business leaders at Davos 2026.",
};

export default function WhitepaperPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <Aurora />
        <Scene
          variant="field"
          className="pointer-events-none absolute inset-0 opacity-25"
        />
        <SectionShell>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>
                <Editable id="whitepaper.hero.eyebrow">Whitepaper · Davos 2026</Editable>
              </Eyebrow>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                <Editable id="whitepaper.hero.title1">The True Cost of</Editable>{" "}
                <span className="text-gradient">
                  <Editable id="whitepaper.hero.title2">AI Adoption</Editable>
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                <Editable id="whitepaper.hero.body">
                  AI adoption cost of AI — the Jeeni whitepaper. Stop asking what
                  AI can do. Start asking what it costs—and what it earns.
                </Editable>
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <EditablePdfButton id="whitepaper.pdf.src" src={PDF} title={PDF_TITLE}>
                  Read the whitepaper
                </EditablePdfButton>
                <MagneticButton href="/resources" variant="ghost" hrefId="whitepaper.hero.cta2.href">
                  <Editable id="whitepaper.hero.cta2">Read the Point of View</Editable>
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <EditablePdfCardTrigger
                id="whitepaper.pdf.src"
                src={PDF}
                title={PDF_TITLE}
                className="glow-ring group relative mx-auto block aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200"
              >
                <EditableImage
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80"
                  alt="Global business leaders at Davos 2026"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  bind={{ scalarId: "whitepaper.hero.image" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <Editable as="p" id="whitepaper.cover.label" className="text-xs font-semibold uppercase tracking-widest text-gold-soft">
                    Jeeni Research · PDF
                  </Editable>
                  <Editable as="p" id="whitepaper.cover.title" className="mt-1 font-display text-lg font-semibold leading-snug text-white break-words">
                    The True Cost of AI Adoption — Davos 2026
                  </Editable>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    View PDF
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </EditablePdfCardTrigger>
            </Reveal>
          </div>
        </SectionShell>
      </section>

      {/* KEY FINDINGS */}
      <SectionShell id="insights" className="scroll-mt-28 py-16" cmsId="whitepaper.findings">
        <Reveal variant="flip" className="max-w-2xl">
          <Eyebrow>
            <Editable id="whitepaper.findings.eyebrow">Key Findings</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="whitepaper.findings.heading1">What does AI cost, and</Editable>{" "}
            <span className="text-gradient">
              <Editable id="whitepaper.findings.heading2">what will it earn?</Editable>
            </span>
          </h2>
        </Reveal>
        <div className="mt-12">
          <StatsRow seed={WHITEPAPER_FINDINGS} />
        </div>
      </SectionShell>

      {/* WHAT'S INSIDE */}
      <SectionShell className="py-16" cmsId="whitepaper.inside">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>
              <Editable id="whitepaper.inside.eyebrow">Inside the report</Editable>
            </Eyebrow>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <Editable id="whitepaper.inside.heading">
                The artificial intelligence revolution isn&apos;t coming—it&apos;s
                here.
              </Editable>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              <Editable id="whitepaper.inside.body">
                Reshaping global economics, infrastructure demands, and competitive
                dynamics at unprecedented speed. Here&apos;s what you&apos;ll take
                away.
              </Editable>
            </p>
          </Reveal>

          <div>
            <InsideList seed={WHITEPAPER_INSIDE} />
          </div>
        </div>
      </SectionShell>

      {/* INLINE READER */}
      <SectionShell id="read" className="scroll-mt-28 py-10">
        <Reveal variant="clip" className="mb-6 max-w-2xl">
          <Eyebrow>
            <Editable id="whitepaper.reader.eyebrow">Read it here</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="whitepaper.reader.heading">
              The whitepaper, right on the page
            </Editable>
          </h2>
        </Reveal>
        <Layer>
          <EditablePdfReader id="whitepaper.pdf.src" src={PDF} title={PDF_TITLE} />
        </Layer>
      </SectionShell>

      {/* CTA */}
      <SectionShell className="py-20" cmsId="whitepaper.cta">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-background-soft to-background px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue/20 blur-[100px]" />
            <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <Editable id="whitepaper.cta.heading1">Get the ROI playbook from</Editable>{" "}
              <span className="text-gradient">
                <Editable id="whitepaper.cta.heading2">Davos 2026</Editable>
              </span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              <Editable id="whitepaper.cta.body">
                Read it inline above, or talk to us about what it means for your
                business.
              </Editable>
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <EditablePdfButton id="whitepaper.pdf.src" src={PDF} title={PDF_TITLE}>
                Read the whitepaper
              </EditablePdfButton>
              <MagneticButton href="/contact-us" variant="ghost" hrefId="whitepaper.cta.talk.href">
                <Editable id="whitepaper.cta.talk">Talk to us</Editable>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </SectionShell>
      <PageExtras pageKey="whitepaper" />
    </>
  );
}
