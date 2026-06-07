import type { Metadata } from "next";
import { Aurora } from "@/components/aurora";
import { Reveal } from "@/components/motion-primitives";
import { ContactForm } from "@/components/contact-form";
import { RoiCalculator } from "@/components/roi-calculator";
import { Scene } from "@/components/scene";
import { Layer } from "@/components/parallax";
import { Eyebrow, SectionShell } from "@/components/ui";
import { Editable } from "@/components/cms/editable";
import { PageExtras } from "@/components/sections/page-extras";
import { BulletPoints } from "@/components/sections/simple-collections";
import { CONTACT_POINTS } from "@/lib/cms/seeds/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us — Business Consulting | Jeeni",
  description:
    "We're here to help. Start a genuine conversation about your AI opportunities and calculate your ROI.",
};

export default function ContactPage() {
  return (
    <>
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
      <Aurora />
      <Scene
        variant="field"
        className="pointer-events-none absolute inset-0 opacity-25"
      />
      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal x={-30}>
            <Eyebrow>
              <Editable id="contact.hero.eyebrow">Business Consulting Contact</Editable>
            </Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              <Editable id="contact.hero.title1">We&apos;re Here</Editable>{" "}
              <span className="text-gradient">
                <Editable id="contact.hero.title2">to Help</Editable>
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              <Editable id="contact.hero.body">
                Tell us where you are in your AI journey. We&apos;ll help you
                measure what AI costs—and what it earns.
              </Editable>
            </p>

            <BulletPoints seed={CONTACT_POINTS} />
          </Reveal>

          <Reveal delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </SectionShell>
    </section>

      <SectionShell className="pb-24" cmsId="contact.roi">
        <Reveal variant="blur" className="mx-auto mb-10 max-w-2xl text-center">
          <Eyebrow>
            <Editable id="contact.roi.eyebrow">Calculate Your ROI</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="contact.roi.heading">
              While you&apos;re here, run the numbers
            </Editable>
          </h2>
        </Reveal>
        <Layer>
          <RoiCalculator />
        </Layer>
      </SectionShell>
      <PageExtras pageKey="contact" />
    </>
  );
}
