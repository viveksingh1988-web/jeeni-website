import Link from "next/link";
import { Aurora } from "@/components/aurora";
import { Reveal } from "@/components/motion-primitives";
import { MagneticButton } from "@/components/magnetic-button";
import { HeroVisual } from "@/components/hero-visual";
import { Marquee } from "@/components/marquee";
import { BlogCard3D } from "@/components/blog-card-3d";
import { BentoGrid, BentoCard, GridGlow, BarsGlow } from "@/components/bento";
import { StatCounter } from "@/components/stat-counter";
import { RoiCalculator } from "@/components/roi-calculator";
import { FAQ } from "@/components/faq";
import { Carousel } from "@/components/carousel";
import { Layer, ParallaxImage } from "@/components/parallax";
import { JsonLd } from "@/components/json-ld";
import { Editable } from "@/components/cms/editable";
import { EditableHeading, EditableTextReveal, EditableStat } from "@/components/cms/editable-heading";
import { CardHoverGrid } from "@/components/card-hover-grid";
import { MovingCards } from "@/components/moving-cards";
import { SpotlightBeam } from "@/components/spotlight-beam";
import { Eyebrow, SectionShell } from "@/components/ui";
import { EditableSection } from "@/components/cms/editable-section";
import { EditableIcon } from "@/components/cms/editable-icon";
import { PageExtras } from "@/components/sections/page-extras";
import { getPosts } from "@/lib/blog-data";
import {
  HOME_MEASURE,
  HOME_PRINCIPLES,
  HOME_SLIDES,
  HOME_FAQ,
} from "@/lib/cms/seeds/home";
import { getStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.items.map((f) => ({
    "@type": "Question",
    name: f.fields.q,
    acceptedAnswer: { "@type": "Answer", text: f.fields.a },
  })),
};

export default async function HomePage() {
  const doc = await getStore().getPublished();
  const posts = getPosts(doc).slice(0, 3);

  return (
    <>
      <JsonLd data={faqSchema} />
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44">
        <Aurora />
        <SectionShell>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <Eyebrow>
                  <Editable id="hero.eyebrow">
                    Rooted in Insight · Powered by Research
                  </Editable>
                </Eyebrow>
              </Reveal>
              <EditableHeading
                id="hero.heading"
                text="We turn futurist research into measurable value."
                delay={0.15}
                className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              />
              <Reveal delay={0.5}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                  <Editable id="hero.subline">
                    We track revenue and savings from day one for clear ROI.
                  </Editable>
                </p>
              </Reveal>
              <Reveal delay={0.65}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <MagneticButton href="/contact-us" hrefId="hero.cta1.href">
                    <Editable id="hero.cta1">Calculate Your ROI</Editable>
                  </MagneticButton>
                  <MagneticButton href="/whitepaper" variant="ghost" hrefId="hero.cta2.href">
                    <Editable id="hero.cta2">Read the whitepaper</Editable>
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            <HeroVisual />
          </div>
        </SectionShell>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden flex-col items-center gap-2 text-muted sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
            Scroll
          </span>
          <span className="flex h-9 w-5 items-start justify-center overflow-hidden rounded-full border border-slate-300 p-1">
            <span className="h-2 w-1 rounded-full bg-blue animate-float" />
          </span>
        </div>
      </section>

      <Marquee />

      {/* ============ APPROACH ============ */}
      <SectionShell className="py-20" cmsId="home.approach">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal variant="left" className="lg:col-span-5">
            <Eyebrow>
              <Editable id="home.approach.eyebrow">Our Approach</Editable>
            </Eyebrow>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              <Editable id="home.approach.heading1">Rooted in Insight,</Editable>{" "}
              <span className="text-gradient">
                <Editable id="home.approach.heading2">
                  Powered by Research
                </Editable>
              </span>
            </h2>
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 card-shadow">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1100&q=80"
                editId="home.approach.image"
                alt="Jeeni team analyzing AI ROI"
                sizes="(max-width: 1024px) 100vw, 460px"
                className="aspect-[4/3]"
              />
            </div>
          </Reveal>

          <Reveal variant="right" delay={0.15} className="lg:col-span-7">
            <div className="glass rounded-3xl p-8 sm:p-10">
              <Editable
                as="p"
                id="home.approach.body"
                className="text-xl leading-relaxed text-foreground/90"
              >
                At Jeeni, we don&apos;t just explore what AI can do. We measure
                what it costs to do it—and what the return actually looks like.
              </Editable>
              <div className="mt-8 border-l-2 border-blue/60 pl-6">
                <Editable
                  as="p"
                  id="home.approach.quote"
                  className="font-display text-2xl font-semibold leading-snug"
                >
                  Stop asking what AI can do. Start asking what it costs—and what
                  it earns.
                </Editable>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* ============ TEXT REVEAL STATEMENT ============ */}
      <SectionShell className="py-24" cmsId="home.statement">
        <EditableTextReveal
          id="home.statement"
          text="We don't just explore what AI can do. We measure what it costs to do it — and what the return actually looks like."
          className="mx-auto max-w-4xl text-center"
        />
      </SectionShell>

      {/* ============ WHAT YOU CAN MEASURE ============ */}
      <SectionShell className="py-20" cmsId="home.measure">
        <Reveal variant="flip" className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>
            <Editable id="home.measure.eyebrow">What you can measure</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="home.measure.heading">Every outcome, quantified</Editable>
          </h2>
        </Reveal>
        <CardHoverGrid seed={HOME_MEASURE} />
      </SectionShell>

      {/* ============ HOW WE DELIVER ROI (BENTO) ============ */}
      <SectionShell className="py-20" cmsId="home.bento">
        <Reveal variant="flip" className="mx-auto max-w-2xl text-center">
          <Eyebrow>
            <Editable id="home.bento.eyebrow">How We Deliver ROI</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="home.bento.heading">
              We turn AI into a number you can bank on
            </Editable>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <BentoGrid className="mt-14">
            <BentoCard
              span="lg:col-span-2"
              featured
              icon={() => <EditableIcon bind={{ scalarId: "home.bento.revenue.icon" }} fallback="trend" />}
              title={<Editable id="home.bento.revenue.title">Revenue Growth</Editable>}
              description={
                <Editable id="home.bento.revenue.body">
                  Measure how AI drives new revenue: automated sales, personalized
                  experiences, faster launches. Track the dollars earned—quarter
                  over quarter growth you can bank on.
                </Editable>
              }
              href="/services"
              cta={<Editable id="home.bento.revenue.cta">Drive Growth</Editable>}
              visual={<BarsGlow />}
            />
            <BentoCard
              icon={() => <EditableIcon bind={{ scalarId: "home.bento.time.icon" }} fallback="clock" />}
              stat={
                <EditableStat id="home.bento.time.stat" text="20+">
                  <StatCounter value={20} suffix="+" />
                </EditableStat>
              }
              title={<Editable id="home.bento.time.title">Time Reclaimed</Editable>}
              description={
                <Editable id="home.bento.time.body">
                  Quantify hours gained per week on average—time your team
                  reinvests in strategy, relationships, and growth.
                </Editable>
              }
              href="/services"
              cta={<Editable id="home.bento.time.cta">Reclaim Hours</Editable>}
            />
            <BentoCard
              icon={() => <EditableIcon bind={{ scalarId: "home.bento.cost.icon" }} fallback="coin" />}
              title={<Editable id="home.bento.cost.title">Cost Optimization</Editable>}
              description={
                <Editable id="home.bento.cost.body">
                  Identify efficiency gains: streamlined workflows, optimized
                  processes, smarter resource allocation. Track every dollar saved.
                </Editable>
              }
              href="/services"
              cta={<Editable id="home.bento.cost.cta">Reduce Spend</Editable>}
            />
            <BentoCard
              span="lg:col-span-2"
              icon={() => <EditableIcon bind={{ scalarId: "home.bento.tracked.icon" }} fallback="target" />}
              title={
                <Editable id="home.bento.tracked.title">
                  Tracked from day one
                </Editable>
              }
              description={
                <Editable id="home.bento.tracked.body">
                  We don&apos;t just explore what AI can do—we measure what it
                  costs to do it, and what the return actually looks like, from the
                  very first deployment.
                </Editable>
              }
              href="/whitepaper"
              cta={<Editable id="home.bento.tracked.cta">See the research</Editable>}
              visual={<GridGlow />}
            />
          </BentoGrid>
        </Reveal>
      </SectionShell>

      {/* ============ ROI CALCULATOR ============ */}
      <SectionShell className="py-20" cmsId="home.roi">
        <Reveal variant="blur" className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>
            <Editable id="home.roi.eyebrow">Calculate Your ROI</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="home.roi.heading">See the value before you commit</Editable>
          </h2>
          <p className="mt-4 text-muted">
            <Editable id="home.roi.body">
              A quick, interactive estimate of what measurable AI could return for
              your team.
            </Editable>
          </p>
        </Reveal>
        <Layer>
          <RoiCalculator />
        </Layer>
      </SectionShell>

      {/* ============ FEATURED RESEARCH ============ */}
      <SectionShell className="py-20" cmsId="home.featured">
        <div className="glow-ring relative overflow-hidden rounded-[2.5rem] border border-slate-200">
          <div className="absolute inset-0">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80"
              editId="home.featured.image"
              alt="Global business leaders collaborating"
              sizes="100vw"
              className="h-full w-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
          <div className="relative grid gap-8 p-10 sm:p-16 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal variant="right">
                <Eyebrow>
                  <Editable id="home.featured.eyebrow">
                    What&apos;s New · Davos 2026
                  </Editable>
                </Eyebrow>
                <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  <Editable id="home.featured.heading">
                    Stop Asking What Can AI Do?
                  </Editable>
                </h2>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
                  <Editable id="home.featured.body">
                    Start asking What does it cost and what will it earn?
                    Jeeni&apos;s research reveals the real ROI playbook from global
                    business leaders at Davos 2026.
                  </Editable>
                </p>
                <div className="mt-8">
                  <MagneticButton href="/whitepaper" hrefId="home.featured.cta.href">
                    <Editable id="home.featured.cta">Get Strategic Insights</Editable>
                  </MagneticButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ============ IN ACTION (CAROUSEL) ============ */}
      <SectionShell className="py-20" cmsId="home.inaction">
        <Reveal variant="clip" className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>
            <Editable id="home.inaction.eyebrow">Jeeni in action</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="home.inaction.heading">
              Measurable outcomes, in every team
            </Editable>
          </h2>
          <p className="mt-4 text-muted">
            <Editable id="home.inaction.body">
              Drag, swipe, or let it play — see where measurable AI creates value.
            </Editable>
          </p>
        </Reveal>
        <Layer>
          <Carousel seed={HOME_SLIDES} />
        </Layer>
      </SectionShell>

      {/* ============ LATEST INSIGHTS (BLOG) ============ */}
      <SectionShell className="py-20" cmsId="home.blog">
        <Reveal variant="flipUp" className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>
              <Editable id="home.blog.eyebrow">From the Blog</Editable>
            </Eyebrow>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <Editable id="home.blog.heading">
                Latest insights on measurable AI value
              </Editable>
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue"
          >
            View all articles
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard3D key={post.slug} post={post} index={i} />
          ))}
        </div>
      </SectionShell>

      {/* ============ PRINCIPLES (MOVING CARDS) ============ */}
      <EditableSection id="home.principles">
      <section className="py-16">
        <Reveal variant="clip" className="mx-auto mb-10 max-w-2xl px-6 text-center">
          <Eyebrow>
            <Editable id="home.principles.eyebrow">What we stand for</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="home.principles.heading">Principles we measure by</Editable>
          </h2>
        </Reveal>
        <MovingCards seed={HOME_PRINCIPLES} />
      </section>
      </EditableSection>

      {/* ============ FAQ ============ */}
      <SectionShell className="py-20" cmsId="home.faq">
        <Reveal variant="swing" className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow>
            <Editable id="home.faq.eyebrow">Questions, answered</Editable>
          </Eyebrow>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <Editable id="home.faq.heading">Everything you want to know</Editable>
          </h2>
        </Reveal>
        <Layer>
          <FAQ seed={HOME_FAQ} />
        </Layer>
      </SectionShell>

      {/* ============ FINAL CTA — DARK SPOTLIGHT ============ */}
      <SectionShell className="py-24" cmsId="home.cta">
        <Reveal variant="zoom">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-deep px-8 py-20 text-center sm:px-16">
            <SpotlightBeam className="-left-20 -top-40 h-[700px]" fill="#38bdf8" />
            <SpotlightBeam className="-right-20 -top-32 h-[700px] scale-x-[-1]" fill="#ca8a04" />
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.07]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
                <Editable id="cta.heading1">Ready to Accelerate Your</Editable>{" "}
                <span className="bg-gradient-to-r from-sky-400 via-blue-bright to-gold-soft bg-clip-text text-transparent">
                  <Editable id="cta.heading2">AI Success?</Editable>
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                <Editable id="cta.subline">
                  A genuine conversation about your AI opportunities. We&apos;ll
                  explore what&apos;s possible, what makes sense for your business,
                  and how to move forward with confidence.
                </Editable>
              </p>
              <div className="mt-9 flex justify-center">
                <MagneticButton href="/whitepaper" hrefId="cta.button.href">
                  <Editable id="cta.button">Explore Your ROI Potential</Editable>
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <PageExtras pageKey="home" />
    </>
  );
}
