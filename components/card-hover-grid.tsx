"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SeedCollection } from "@/lib/cms/types";
import { Editable } from "@/components/cms/editable";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";

/* Card-hover effect (Aceternity / 21st.dev): a soft highlight slides behind
   whichever card you hover. Content comes from a CMS collection. */
export function CardHoverGrid({ seed }: { seed: SeedCollection }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item._id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`relative block p-1.5 ${editing ? "cms-item cms-on" : ""}`}
          >
            {editing && (
              <ItemControls
                seed={seed}
                currentIds={ids}
                item={item}
                index={i}
                total={items.length}
              />
            )}
            <AnimatePresence>
              {hovered === i && !editing && (
                <motion.span
                  layoutId="hover-highlight"
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue/10 to-gold/10 ring-1 ring-blue/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 h-full rounded-3xl border border-slate-200 bg-white p-7 card-shadow">
              <Editable
                as="h3"
                bind={{ loc, itemId: item._id, field: "title" }}
                className="font-display text-lg font-semibold"
              >
                {item.fields.title}
              </Editable>
              <Editable
                as="p"
                bind={{ loc, itemId: item._id, field: "body" }}
                className="mt-2 text-sm leading-relaxed text-muted"
              >
                {item.fields.body}
              </Editable>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <AddItem
          seed={seed}
          currentIds={ids}
          label="Add card"
          fields={() => ({ title: "New title", body: "New description" })}
        />
      </div>
    </>
  );
}
