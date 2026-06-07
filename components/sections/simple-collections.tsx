"use client";

import { Stagger, StaggerItem } from "@/components/motion-primitives";
import type { SeedCollection } from "@/lib/cms/types";
import { Editable } from "@/components/cms/editable";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";

/* Numbered process steps (what-we-do). */
export function StepsList({ seed }: { seed: SeedCollection }) {
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;
  return (
    <>
      <Stagger className="mt-12 space-y-4">
        {items.map((s, i) => (
          <StaggerItem key={s._id} className={editing ? "cms-item cms-on relative" : ""}>
            {editing && (
              <ItemControls seed={seed} currentIds={ids} item={s} index={i} total={items.length} />
            )}
            <div className="glass group flex flex-col gap-4 rounded-3xl p-8 transition-colors hover:bg-slate-100 sm:flex-row sm:items-center sm:gap-8">
              <Editable
                bind={{ loc, itemId: s._id, field: "n" }}
                className="font-display text-4xl font-extrabold text-gradient sm:w-24"
              >
                {s.fields.n}
              </Editable>
              <div className="flex-1">
                <Editable as="h3" bind={{ loc, itemId: s._id, field: "title" }} className="font-display text-xl font-semibold">
                  {s.fields.title}
                </Editable>
                <Editable as="p" bind={{ loc, itemId: s._id, field: "body" }} className="mt-2 text-muted">
                  {s.fields.body}
                </Editable>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="flex justify-center">
        <AddItem seed={seed} currentIds={ids} label="Add step" fields={() => ({ n: "0", title: "New step", body: "Describe this step." })} />
      </div>
    </>
  );
}

/* Checklist of bullet points (contact page). */
export function BulletPoints({ seed }: { seed: SeedCollection }) {
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;
  return (
    <>
      <ul className="mt-8 space-y-4">
        {items.map((p, i) => (
          <li key={p._id} className={`flex items-start gap-3 ${editing ? "cms-item cms-on relative" : ""}`}>
            {editing && (
              <ItemControls seed={seed} currentIds={ids} item={p} index={i} total={items.length} />
            )}
            <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy text-white">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <Editable bind={{ loc, itemId: p._id, field: "text" }} className="text-foreground/90">
              {p.fields.text}
            </Editable>
          </li>
        ))}
      </ul>
      <div className="flex">
        <AddItem seed={seed} currentIds={ids} label="Add point" fields={() => ({ text: "New point." })} />
      </div>
    </>
  );
}

/* A row of big stat figures (resources / whitepaper). */
export function StatsRow({
  seed,
  className = "",
}: {
  seed: SeedCollection;
  className?: string;
}) {
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;
  return (
    <>
      <div className={`grid gap-6 sm:grid-cols-3 ${className}`}>
        {items.map((s, i) => (
          <div
            key={s._id}
            className={`rounded-3xl border border-slate-200 bg-white p-7 text-center card-shadow ${editing ? "cms-item cms-on relative" : ""}`}
          >
            {editing && (
              <ItemControls seed={seed} currentIds={ids} item={s} index={i} total={items.length} />
            )}
            <Editable as="div" bind={{ loc, itemId: s._id, field: "value" }} className="font-display text-4xl font-extrabold text-gradient">
              {s.fields.value}
            </Editable>
            <Editable as="div" bind={{ loc, itemId: s._id, field: "label" }} className="mt-2 text-sm text-muted">
              {s.fields.label}
            </Editable>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center">
        <AddItem seed={seed} currentIds={ids} label="Add stat" fields={() => ({ value: "00", label: "New stat" })} />
      </div>
    </>
  );
}

/* A bulleted "inside the report" list (whitepaper). */
export function InsideList({ seed }: { seed: SeedCollection }) {
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;
  return (
    <>
      <ul className="mt-6 space-y-4">
        {items.map((it, i) => (
          <li key={it._id} className={`flex items-start gap-3 ${editing ? "cms-item cms-on relative" : ""}`}>
            {editing && (
              <ItemControls seed={seed} currentIds={ids} item={it} index={i} total={items.length} />
            )}
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-br from-blue to-navy" />
            <Editable bind={{ loc, itemId: it._id, field: "text" }} className="text-lg leading-relaxed text-foreground/85">
              {it.fields.text}
            </Editable>
          </li>
        ))}
      </ul>
      <div className="flex">
        <AddItem seed={seed} currentIds={ids} label="Add item" fields={() => ({ text: "New item." })} />
      </div>
    </>
  );
}
