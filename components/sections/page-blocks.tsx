"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { Editable } from "@/components/cms/editable";
import { EditableImage } from "@/components/cms/editable-image";
import { EditableIcon } from "@/components/cms/editable-icon";
import { useCMS } from "@/components/cms/edit-context";
import { ItemControls, AddItem } from "@/components/cms/collection-editor";
import { SITE_PAGES } from "@/lib/cms/pages";
import { setActivePage, clearActivePage } from "@/lib/cms/active-page-store";
import type { ResolvedItem, SeedCollection } from "@/lib/cms/types";
import type { Locator } from "@/lib/cms/mutate";

import { PALETTE, PALETTE_CATEGORIES } from "@/lib/cms/palette";

const STOCK = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
const AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
const IMG2 = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80";
const IMG3 = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80";
const IMG4 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

export function PageBlocks({
  pageId,
  seed = SITE_PAGES,
}: {
  pageId: string;
  seed?: SeedCollection;
}) {
  const cms = useCMS();
  const editing = !!cms?.editMode;
  const page = cms?.resolve(seed).find((p) => p._id === pageId);
  const blocks = page?.children?.blocks ?? [];
  const ids = blocks.map((b) => b._id);
  const loc = useMemo<Locator>(
    () => ({ kind: "child", parentId: seed.id, itemId: pageId, childKey: "blocks" }),
    [seed.id, pageId]
  );

  // Keep a live ref so the component picker always sees the current block IDs.
  const idsRef = useRef(ids);
  idsRef.current = ids;

  // Register this PageBlocks as the active editing target so the component
  // picker can add sections to any page type (site.pages OR site.extras).
  const label = pageId.startsWith("page:")
    ? `/${pageId.replace("page:", "").replace(/^home$/, "")}`
    : `/${pageId}`;
  useEffect(() => {
    if (!editing) { clearActivePage(); return; }
    setActivePage({ loc, getBlockIds: () => idsRef.current, label });
    return clearActivePage;
  }, [editing, loc, label]);

  return (
    <>
      {blocks.map((b, i) => (
        <div key={b._id} id={`cms-block-${b._id}`} className={editing ? "cms-item cms-on relative" : ""}>
          {editing && <ItemControls loc={loc} currentIds={ids} item={b} index={i} total={blocks.length} />}
          <Block block={b} loc={loc} />
        </div>
      ))}

      {editing && (
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-dashed border-slate-300 p-5">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted">
            Add a section from the library
          </p>
          {PALETTE_CATEGORIES.map((cat) => (
            <div key={cat} className="mb-3">
              <p className="mb-1.5 text-[11px] font-semibold text-muted">{cat}</p>
              <div className="flex flex-wrap gap-2">
                {PALETTE.filter((p) => p.category === cat).map((p) => (
                  <AddItem
                    key={p.type}
                    loc={loc}
                    currentIds={ids}
                    label={p.label}
                    className="!m-0"
                    fields={p.fields}
                    onAdded={(id) => {
                      requestAnimationFrame(() => {
                        document.getElementById(`cms-block-${id}`)
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ───────────────────────── Renderers ───────────────────────── */
function Block({ block, loc }: { block: ResolvedItem; loc: Locator }) {
  const cms = useCMS();
  const f = block.fields;
  const id = block._id;
  const editing = !!cms?.editMode;
  const bind = (field: string) => ({ loc, itemId: id, field });
  const iconBind = (field: string) => ({ loc, itemId: id, field });

  switch (f.type) {
    case "hero":
      return (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <EditableImage src={f.image} alt={f.title || ""} fill sizes="100vw" className="object-cover opacity-15" bind={bind("image")} />
          </div>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <Eyebrow><Editable bind={bind("eyebrow")}>{f.eyebrow}</Editable></Eyebrow>
            <Editable as="h2" bind={bind("title")} className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{f.title}</Editable>
            <Editable as="p" bind={bind("subtitle")} className="mx-auto mt-5 max-w-2xl text-lg text-muted">{f.subtitle}</Editable>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BlockBtn loc={loc} id={id} labelField="cta1" hrefField="cta1href" label={f.cta1} href={f.cta1href} editing={editing} primary />
              <BlockBtn loc={loc} id={id} labelField="cta2" hrefField="cta2href" label={f.cta2} href={f.cta2href} editing={editing} />
            </div>
          </div>
        </section>
      );

    case "heading":
      return (
        <section className="mx-auto max-w-3xl px-6 py-12 text-center">
          <Eyebrow><Editable bind={bind("eyebrow")}>{f.eyebrow}</Editable></Eyebrow>
          <Editable as="h2" bind={bind("title")} className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.title}</Editable>
          <Editable as="p" bind={bind("subtitle")} className="mt-4 text-lg text-muted">{f.subtitle}</Editable>
        </section>
      );

    case "paragraph":
      return (
        <section className="mx-auto max-w-3xl px-6 py-6">
          <Editable as="p" bind={bind("text")} className="text-lg leading-relaxed text-foreground/85">{f.text}</Editable>
        </section>
      );

    case "columns":
      return (
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 card-shadow">
            <EditableImage src={f.image} alt={f.title || ""} fill sizes="(max-width:1024px) 100vw, 560px" className="object-cover" bind={bind("image")} />
          </div>
          <div>
            <Editable as="h2" bind={bind("title")} className="font-display text-3xl font-bold tracking-tight">{f.title}</Editable>
            <Editable as="p" bind={bind("body")} className="mt-5 text-lg leading-relaxed text-muted">{f.body}</Editable>
          </div>
        </section>
      );

    case "features3":
      return (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <Editable as="h2" bind={bind("heading")} className="mb-10 text-center font-display text-3xl font-bold tracking-tight">{f.heading}</Editable>
          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-3xl border border-slate-200 bg-white p-7 card-shadow">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white">
                  <EditableIcon bind={iconBind(`f${n}icon`)} fallback={f[`f${n}icon`] || "spark"} className="h-6 w-6" />
                </div>
                <Editable as="h3" bind={bind(`f${n}title`)} className="font-display text-lg font-semibold">{f[`f${n}title`]}</Editable>
                <Editable as="p" bind={bind(`f${n}body`)} className="mt-2 text-sm leading-relaxed text-muted">{f[`f${n}body`]}</Editable>
              </div>
            ))}
          </div>
        </section>
      );

    case "steps":
      return (
        <section className="mx-auto max-w-4xl px-6 py-14">
          <Editable as="h2" bind={bind("heading")} className="mb-10 text-center font-display text-3xl font-bold tracking-tight">{f.heading}</Editable>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass flex flex-col gap-4 rounded-3xl p-7 sm:flex-row sm:items-center sm:gap-8">
                <Editable bind={bind(`s${n}n`)} className="font-display text-4xl font-extrabold text-gradient sm:w-20">{f[`s${n}n`]}</Editable>
                <div className="flex-1">
                  <Editable as="h3" bind={bind(`s${n}t`)} className="font-display text-xl font-semibold">{f[`s${n}t`]}</Editable>
                  <Editable as="p" bind={bind(`s${n}b`)} className="mt-1 text-muted">{f[`s${n}b`]}</Editable>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="mx-auto grid max-w-5xl gap-6 px-6 py-12 sm:grid-cols-3">
          {[["v1", "l1"], ["v2", "l2"], ["v3", "l3"]].map(([v, l]) => (
            <div key={v} className="rounded-3xl border border-slate-200 bg-white p-7 text-center card-shadow">
              <Editable as="div" bind={bind(v)} className="font-display text-4xl font-extrabold text-gradient">{f[v]}</Editable>
              <Editable as="div" bind={bind(l)} className="mt-2 text-sm text-muted">{f[l]}</Editable>
            </div>
          ))}
        </section>
      );

    case "quote":
      return (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="border-l-2 border-blue/60 pl-6">
            <Editable as="p" bind={bind("text")} className="font-display text-2xl font-semibold leading-snug">{f.text}</Editable>
            <Editable as="p" bind={bind("author")} className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue">{f.author}</Editable>
          </div>
        </section>
      );

    case "image":
      return (
        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl border border-slate-200 card-shadow">
            <EditableImage src={f.src} alt={f.alt || ""} fill sizes="100vw" className="object-cover" bind={bind("src")} />
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <Editable as="h2" bind={bind("heading")} className="mb-8 text-center font-display text-3xl font-bold tracking-tight">{f.heading}</Editable>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {["g1", "g2", "g3", "g4", "g5", "g6"].map((g) => (
              <div key={g} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200">
                <EditableImage src={f[g]} alt="" fill sizes="(max-width:640px) 50vw, 33vw" className="object-cover" bind={bind(g)} />
              </div>
            ))}
          </div>
        </section>
      );

    case "video": {
      const embed = toEmbed(f.url);
      return (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200 card-shadow">
            {embed ? (
              <iframe src={embed} title="Video" className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted">Set a YouTube/Vimeo URL</div>
            )}
          </div>
          {editing && (
            <div className="mt-2 text-center">
              <button type="button" className="cms-add" onClick={() => { const v = window.prompt("Video URL (YouTube/Vimeo)", f.url); if (v != null) cms!.setItemField(loc, id, "url", v); }}>▶ Change video URL</button>
            </div>
          )}
        </section>
      );
    }

    case "logos":
      return (
        <section className="mx-auto max-w-6xl px-6 py-12 text-center">
          <Editable as="p" bind={bind("heading")} className="mb-8 text-sm font-semibold uppercase tracking-widest text-muted">{f.heading}</Editable>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["l1", "l2", "l3", "l4", "l5"].map((l) => (
              <div key={l} className="relative h-12 w-28 opacity-70 grayscale">
                <EditableImage src={f[l]} alt="" fill sizes="112px" className="object-contain" bind={bind(l)} />
              </div>
            ))}
          </div>
        </section>
      );

    case "testimonial":
      return (
        <section className="mx-auto max-w-3xl px-6 py-14 text-center">
          <Editable as="p" bind={bind("quote")} className="font-display text-2xl font-semibold leading-snug">“{f.quote}”</Editable>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <EditableImage src={f.avatar} alt={f.author || ""} fill sizes="48px" className="object-cover" bind={bind("avatar")} />
            </div>
            <div className="text-left">
              <Editable bind={bind("author")} className="block text-sm font-semibold">{f.author}</Editable>
              <Editable bind={bind("role")} className="block text-xs text-muted">{f.role}</Editable>
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-deep px-8 py-16 text-center text-white sm:px-16">
            <Editable as="h2" bind={bind("heading")} className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
            <Editable as="p" bind={bind("body")} className="mx-auto mt-5 max-w-2xl text-lg text-white/70">{f.body}</Editable>
            <div className="mt-8 flex justify-center">
              <BlockBtn loc={loc} id={id} labelField="button" hrefField="href" label={f.button} href={f.href} editing={editing} primary />
            </div>
          </div>
        </section>
      );

    case "banner":
      return (
        <section className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue to-navy px-6 py-5 text-white sm:flex-row">
            <Editable bind={bind("text")} className="font-medium">{f.text}</Editable>
            <BlockBtn loc={loc} id={id} labelField="button" hrefField="href" label={f.button} href={f.href} editing={editing} light />
          </div>
        </section>
      );

    case "spacer": {
      const h = f.size === "lg" ? "h-32" : f.size === "sm" ? "h-8" : "h-20";
      return <div className={h} />;
    }

    case "divider":
      return <div className="mx-auto max-w-5xl px-6 py-4"><div className="h-px bg-slate-200" /></div>;

    /* ──────────────── 21st.dev Components ──────────────── */

    case "hero-gradient":
      return (
        <section className="relative overflow-hidden px-6 py-28 text-center">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue/15 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-gold/10 blur-[80px]" />
          <div className="relative mx-auto max-w-4xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-4 py-1.5 text-xs font-semibold text-blue">
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />
              <Editable bind={bind("eyebrow")}>{f.eyebrow}</Editable>
            </span>
            <Editable as="h1" bind={bind("title")} className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              {f.title}
            </Editable>
            {f.gradient && (
              <Editable as="p" bind={bind("gradient")} className="mt-0 font-display text-4xl font-extrabold tracking-tight text-gradient sm:text-6xl lg:text-7xl">
                {f.gradient}
              </Editable>
            )}
            <Editable as="p" bind={bind("subtitle")} className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              {f.subtitle}
            </Editable>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <BlockBtn loc={loc} id={id} labelField="cta1" hrefField="cta1href" label={f.cta1} href={f.cta1href} editing={editing} primary />
              <BlockBtn loc={loc} id={id} labelField="cta2" hrefField="cta2href" label={f.cta2} href={f.cta2href} editing={editing} />
            </div>
          </div>
        </section>
      );

    case "feature-bento":
      return (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <Editable as="h2" bind={bind("heading")} className="mb-10 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {f.heading}
          </Editable>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([["f1", "lg:col-span-2 row-span-2"], ["f2", ""], ["f3", ""], ["f4", "lg:col-span-2"]] as [string, string][]).map(([n, span]) => (
              <div key={n} className={`${span} glow-ring relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 card-shadow`}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white">
                  <EditableIcon bind={iconBind(`${n}icon`)} fallback={f[`${n}icon`] || "spark"} className="h-5 w-5" />
                </div>
                <Editable as="h3" bind={bind(`${n}title`)} className="font-display text-lg font-semibold">{f[`${n}title`]}</Editable>
                <Editable as="p" bind={bind(`${n}body`)} className="mt-2 text-sm leading-relaxed text-muted">{f[`${n}body`]}</Editable>
              </div>
            ))}
          </div>
        </section>
      );

    case "timeline":
      return (
        <section className="mx-auto max-w-3xl px-6 py-14">
          <Editable as="h2" bind={bind("heading")} className="mb-12 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-blue/60 to-transparent" />
            {(["t1", "t2", "t3", "t4"] as const).map((t, i) => f[`${t}title`] ? (
              <div key={t} className="relative mb-10 pl-12">
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy text-xs font-bold text-white shadow">
                  {i + 1}
                </div>
                <Editable bind={bind(`${t}label`)} className="text-xs font-semibold uppercase tracking-widest text-blue">{f[`${t}label`]}</Editable>
                <Editable as="h3" bind={bind(`${t}title`)} className="mt-1 font-display text-xl font-semibold">{f[`${t}title`]}</Editable>
                <Editable as="p" bind={bind(`${t}body`)} className="mt-2 leading-relaxed text-muted">{f[`${t}body`]}</Editable>
              </div>
            ) : null)}
          </div>
        </section>
      );

    case "pricing": {
      const plans = ["p1", "p2", "p3"] as const;
      return (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Editable as="h2" bind={bind("heading")} className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
            <Editable as="p" bind={bind("subheading")} className="mt-4 text-lg text-muted">{f.subheading}</Editable>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {plans.map((p) => {
              const popular = f[`${p}popular`] === "true";
              return (
                <div key={p} className={`relative flex flex-col rounded-3xl border p-8 ${popular ? "border-blue shadow-[0_0_0_2px] shadow-blue/20 bg-navy-deep text-white" : "border-slate-200 bg-white card-shadow"}`}>
                  {popular && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue px-3 py-0.5 text-xs font-bold text-white">Most popular</span>}
                  <Editable as="h3" bind={bind(`${p}name`)} className={`font-display text-xl font-bold ${popular ? "text-white" : ""}`}>{f[`${p}name`]}</Editable>
                  <div className="mt-4 flex items-baseline gap-1">
                    <Editable as="span" bind={bind(`${p}price`)} className={`font-display text-4xl font-extrabold ${popular ? "text-white" : "text-gradient"}`}>{f[`${p}price`]}</Editable>
                    <Editable bind={bind(`${p}period`)} className={`text-sm ${popular ? "text-white/70" : "text-muted"}`}>{f[`${p}period`]}</Editable>
                  </div>
                  <Editable as="p" bind={bind(`${p}desc`)} className={`mt-3 text-sm ${popular ? "text-white/70" : "text-muted"}`}>{f[`${p}desc`]}</Editable>
                  <ul className="my-6 flex-1 space-y-2.5">
                    {["f1","f2","f3","f4"].filter(fi => f[`${p}${fi}`]).map(fi => (
                      <li key={fi} className="flex items-center gap-2 text-sm">
                        <svg viewBox="0 0 24 24" className={`h-4 w-4 flex-none ${popular ? "text-blue-bright" : "text-blue"}`} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                        <Editable bind={bind(`${p}${fi}`)}>{f[`${p}${fi}`]}</Editable>
                      </li>
                    ))}
                  </ul>
                  <BlockBtn loc={loc} id={id} labelField={`${p}cta`} hrefField={`${p}href`} label={f[`${p}cta`]} href={f[`${p}href`]} editing={editing} primary={popular} />
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case "team": {
      const members = ["m1", "m2", "m3"] as const;
      return (
        <section className="mx-auto max-w-5xl px-6 py-14 text-center">
          <Editable as="h2" bind={bind("heading")} className="mb-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
          <Editable as="p" bind={bind("subheading")} className="mb-10 text-lg text-muted">{f.subheading}</Editable>
          <div className="grid gap-8 sm:grid-cols-3">
            {members.map((m) => f[`${m}name`] ? (
              <div key={m} className="group">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-2xl border-2 border-slate-100 ring-4 ring-slate-50 transition-transform group-hover:scale-105">
                  <EditableImage src={f[`${m}img`] || AVATAR} alt={f[`${m}name`] || ""} fill sizes="96px" className="object-cover" bind={bind(`${m}img`)} />
                </div>
                <Editable as="h3" bind={bind(`${m}name`)} className="font-display text-lg font-semibold">{f[`${m}name`]}</Editable>
                <Editable as="p" bind={bind(`${m}role`)} className="text-sm font-medium text-blue">{f[`${m}role`]}</Editable>
                <Editable as="p" bind={bind(`${m}bio`)} className="mt-2 text-sm text-muted">{f[`${m}bio`]}</Editable>
              </div>
            ) : null)}
          </div>
        </section>
      );
    }

    case "faq-21": {
      return (
        <section className="mx-auto max-w-3xl px-6 py-14">
          <Editable as="h2" bind={bind("heading")} className="mb-10 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
          <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white card-shadow">
            {(["q1","q2","q3","q4"] as const).filter(q => f[q]).map((q) => {
              const a = q.replace("q", "a") as keyof typeof f;
              return (
                <details key={q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold">
                    <Editable bind={bind(q as string)}>{f[q]}</Editable>
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-slate-100 text-xs transition group-open:bg-blue group-open:text-white">▾</span>
                  </summary>
                  <Editable as="p" bind={bind(a as string)} className="mt-3 text-muted">{f[a as string]}</Editable>
                </details>
              );
            })}
          </div>
        </section>
      );
    }

    case "image-mosaic":
      return (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <Editable as="h2" bind={bind("heading")} className="mb-8 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
          <div className="grid h-[500px] grid-cols-3 grid-rows-2 gap-3">
            <div className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl">
              <EditableImage src={f.i1} alt="" fill sizes="66vw" className="object-cover" bind={bind("i1")} />
            </div>
            <div className="relative overflow-hidden rounded-3xl">
              <EditableImage src={f.i2} alt="" fill sizes="33vw" className="object-cover" bind={bind("i2")} />
            </div>
            <div className="relative overflow-hidden rounded-3xl">
              <EditableImage src={f.i3} alt="" fill sizes="33vw" className="object-cover" bind={bind("i3")} />
            </div>
          </div>
        </section>
      );

    case "testimonials-3":
      return (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <Editable as="h2" bind={bind("heading")} className="mb-10 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
          <div className="grid gap-6 sm:grid-cols-3">
            {(["t1","t2","t3"] as const).map((t) => (
              <div key={t} className="rounded-3xl border border-slate-200 bg-white p-7 card-shadow">
                <div className="mb-1 flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-gold" aria-hidden><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9z"/></svg>)}
                </div>
                <Editable as="p" bind={bind(`${t}q`)} className="mt-3 text-sm leading-relaxed">&ldquo;{f[`${t}q`]}&rdquo;</Editable>
                <div className="mt-5 flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <EditableImage src={f[`${t}img`]} alt="" fill sizes="40px" className="object-cover" bind={bind(`${t}img`)} />
                  </div>
                  <div>
                    <Editable as="p" bind={bind(`${t}a`)} className="text-sm font-semibold">{f[`${t}a`]}</Editable>
                    <Editable as="p" bind={bind(`${t}r`)} className="text-xs text-muted">{f[`${t}r`]}</Editable>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case "cta-split":
      return (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 card-shadow lg:grid-cols-2">
            <div className="bg-navy-deep p-10 text-white lg:p-14">
              <Editable as="h2" bind={bind("heading")} className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{f.heading}</Editable>
              <Editable as="p" bind={bind("body")} className="mt-5 text-lg text-white/70">{f.body}</Editable>
              <div className="mt-8 flex flex-wrap gap-4">
                <BlockBtn loc={loc} id={id} labelField="cta1" hrefField="cta1href" label={f.cta1} href={f.cta1href} editing={editing} light />
                <BlockBtn loc={loc} id={id} labelField="cta2" hrefField="cta2href" label={f.cta2} href={f.cta2href} editing={editing} />
              </div>
            </div>
            <div className="relative min-h-[300px] lg:min-h-0">
              <EditableImage src={f.image} alt="" fill sizes="50vw" className="object-cover" bind={bind("image")} />
            </div>
          </div>
        </section>
      );

    case "newsletter":
      return (
        <section className="mx-auto max-w-2xl px-6 py-14 text-center">
          <Editable as="h2" bind={bind("heading")} className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{f.heading}</Editable>
          <Editable as="p" bind={bind("body")} className="mt-4 text-lg text-muted">{f.body}</Editable>
          <form className="mt-8 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue/60 focus:ring-2 focus:ring-blue/20"
              placeholder={f.placeholder || "Enter your email"} />
            <button type="submit" className="rounded-xl bg-gradient-to-r from-blue to-navy px-6 py-3 text-sm font-semibold text-white">
              <Editable bind={bind("button")}>{f.button}</Editable>
            </button>
          </form>
          <p className="mt-3 text-xs text-muted">No spam. Unsubscribe any time.</p>
        </section>
      );

    default:
      return null;
  }
}

/* CTA button inside a block — editable label + link target. */
function BlockBtn({
  loc, id, labelField, hrefField, label, href, editing, primary, light,
}: {
  loc: Locator; id: string; labelField: string; hrefField: string;
  label: string; href: string; editing: boolean; primary?: boolean; light?: boolean;
}) {
  const cms = useCMS();
  const cls = light
    ? "bg-white text-navy-deep"
    : primary
      ? "bg-gradient-to-r from-blue via-blue-bright to-navy text-white"
      : "border border-slate-300 bg-white text-foreground";
  return (
    <span className="relative inline-flex">
      <Link
        href={href || "#"}
        onClick={(e) => editing && e.preventDefault()}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${cls}`}
      >
        <Editable bind={{ loc, itemId: id, field: labelField }}>{label}</Editable>
      </Link>
      {editing && (
        <button
          type="button"
          className="cms-link-edit"
          title={`Edit link (currently ${href})`}
          onClick={() => { const v = window.prompt("Link target", href); if (v != null) cms!.setItemField(loc, id, hrefField, v); }}
        >
          🔗
        </button>
      )}
    </span>
  );
}

/* Convert a YouTube/Vimeo watch URL to an embeddable URL. */
function toEmbed(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  if (/\/embed\/|player\./.test(url)) return url;
  return null;
}
