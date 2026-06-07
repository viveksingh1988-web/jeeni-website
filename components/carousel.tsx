"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import type { SeedCollection } from "@/lib/cms/types";
import { Editable } from "@/components/cms/editable";
import { EditableImage } from "@/components/cms/editable-image";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";

const EASE = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

/* Snazzy image carousel — drag/swipe, autoplay, arrows, dots, Ken-Burns zoom.
   In edit mode it becomes a static, editable stack of slides. Content comes
   from a CMS collection. */
export function Carousel({
  seed,
  interval = 5500,
}: {
  seed: SeedCollection;
  interval?: number;
}) {
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;

  const [[page, dir], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const n = Math.max(items.length, 1);
  const index = ((page % n) + n) % n;
  const paginate = (d: number) => setPage([page + d, d]);

  useEffect(() => {
    if (paused || editing || items.length <= 1) return;
    const t = setInterval(() => setPage(([p]) => [p + 1, 1]), interval);
    return () => clearInterval(t);
  }, [paused, interval, editing, items.length]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -80) paginate(1);
    else if (info.offset.x > 80) paginate(-1);
  }

  /* ---- Edit mode: a static, editable stack ---- */
  if (editing) {
    return (
      <div className="space-y-5">
        {items.map((it, i) => (
          <div
            key={it._id}
            className="cms-item cms-on relative grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 card-shadow sm:grid-cols-[280px_1fr]"
          >
            <ItemControls
              seed={seed}
              currentIds={ids}
              item={it}
              index={i}
              total={items.length}
            />
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <EditableImage
                src={it.fields.image}
                alt={it.fields.title}
                fill
                sizes="280px"
                bind={{ loc, itemId: it._id, field: "image" }}
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <Editable
                bind={{ loc, itemId: it._id, field: "eyebrow" }}
                className="text-xs font-semibold uppercase tracking-widest text-blue"
              >
                {it.fields.eyebrow}
              </Editable>
              <Editable
                as="h3"
                bind={{ loc, itemId: it._id, field: "title" }}
                className="mt-2 font-display text-xl font-bold"
              >
                {it.fields.title}
              </Editable>
              <Editable
                as="p"
                bind={{ loc, itemId: it._id, field: "text" }}
                className="mt-2 text-sm leading-relaxed text-muted"
              >
                {it.fields.text}
              </Editable>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <AddItem
            seed={seed}
            currentIds={ids}
            label="Add slide"
            fields={() => ({
              image:
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
              eyebrow: "New",
              title: "New slide",
              text: "Describe this slide.",
            })}
          />
        </div>
      </div>
    );
  }

  /* ---- View mode: animated carousel ---- */
  if (items.length === 0) return null;
  const s = items[index].fields;

  return (
    <div
      className="glow-ring relative overflow-hidden rounded-[2rem] border border-slate-200 card-shadow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/7]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={page}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <motion.div
              initial={{ scale: 1.02 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: interval / 1000 + 1, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover"
                draggable={false}
                priority={index === 0}
                unoptimized={s.image.startsWith("/api/media/")}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/90 via-navy-deep/55 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-8 sm:px-14">
                <motion.p
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-xs font-semibold uppercase tracking-widest text-gold-soft"
                >
                  {s.eyebrow}
                </motion.p>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.55 }}
                  className="mt-3 font-display text-2xl font-bold text-white sm:text-4xl"
                >
                  {s.title}
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.55 }}
                  className="mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base"
                >
                  {s.text}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-5 right-5 z-10 flex gap-2">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-navy-deep shadow-lg backdrop-blur transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next slide"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-navy-deep shadow-lg backdrop-blur transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        <div className="absolute bottom-8 left-8 z-10 flex gap-2 sm:left-14">
          {items.map((_, k) => (
            <button
              key={k}
              onClick={() => setPage([k, k > index ? 1 : -1])}
              aria-label={`Go to slide ${k + 1}`}
              className="h-2 cursor-pointer rounded-full bg-white transition-all"
              style={{ width: k === index ? 28 : 8, opacity: k === index ? 1 : 0.5 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
