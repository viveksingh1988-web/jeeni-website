"use client";

import type { SeedCollection } from "@/lib/cms/types";
import { Editable } from "@/components/cms/editable";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";

/* Infinite moving cards (Aceternity / 21st.dev): a row of cards that scrolls
   forever and pauses on hover. While editing, the marquee is paused and each
   card shows reorder/delete controls. Content comes from a CMS collection. */
export function MovingCards({ seed }: { seed: SeedCollection }) {
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;

  // In edit mode show a single (non-duplicated, non-animated) row so editing is sane.
  const row = editing ? items : [...items, ...items];

  return (
    <>
      <div className="group relative flex overflow-hidden">
        <div
          className={`flex w-max gap-5 pr-5 ${
            editing
              ? "flex-wrap justify-center"
              : "animate-marquee group-hover:[animation-play-state:paused]"
          }`}
        >
          {row.map((c, i) => (
            <figure
              key={editing ? c._id : i}
              className={`flex w-[330px] shrink-0 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 card-shadow ${
                editing ? "cms-item cms-on" : ""
              }`}
            >
              {editing && (
                <ItemControls
                  seed={seed}
                  currentIds={ids}
                  item={c}
                  index={i}
                  total={items.length}
                />
              )}
              <blockquote className="text-base leading-relaxed text-foreground/90">
                “
                <Editable bind={{ loc, itemId: c._id, field: "quote" }}>
                  {c.fields.quote}
                </Editable>
                ”
              </blockquote>
              <figcaption className="mt-5 text-xs font-semibold uppercase tracking-widest text-blue">
                <Editable bind={{ loc, itemId: c._id, field: "label" }}>
                  {c.fields.label}
                </Editable>
              </figcaption>
            </figure>
          ))}
        </div>
        {!editing && (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
          </>
        )}
      </div>
      {editing && (
        <div className="flex justify-center">
          <AddItem
            seed={seed}
            currentIds={ids}
            label="Add principle"
            fields={() => ({ quote: "New principle", label: "Label" })}
          />
        </div>
      )}
    </>
  );
}
