"use client";

import { Editable } from "@/components/cms/editable";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";
import { HOME_MARQUEE } from "@/lib/cms/seeds/home";

const LOC = { kind: "top", id: HOME_MARQUEE.id } as const;

/* Seamless infinite marquee of value-prop keywords. Editable as a collection;
   in edit mode it pauses into a static, reorderable row. */
export function Marquee() {
  const { editing, items } = useCollectionItems(HOME_MARQUEE);
  const ids = items.map((i) => i._id);

  if (editing) {
    return (
      <div className="border-y border-slate-200 bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
          {items.map((it, i) => (
            <span
              key={it._id}
              className="cms-item cms-on relative flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted"
            >
              <ItemControls
                seed={HOME_MARQUEE}
                currentIds={ids}
                item={it}
                index={i}
                total={items.length}
              />
              <Editable bind={{ loc: LOC, itemId: it._id, field: "text" }}>
                {it.fields.text}
              </Editable>
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            </span>
          ))}
          <AddItem
            seed={HOME_MARQUEE}
            currentIds={ids}
            label="Add keyword"
            fields={() => ({ text: "New keyword" })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex overflow-hidden border-y border-slate-200 bg-white py-5">
      {[0, 1].map((row) => (
        <div
          key={row}
          aria-hidden={row === 1}
          className="flex shrink-0 animate-marquee items-center gap-8 pr-8"
        >
          {items.map((it, i) => (
            <span
              key={`${row}-${i}`}
              className="flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em] text-muted"
            >
              {it.fields.text}
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            </span>
          ))}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
