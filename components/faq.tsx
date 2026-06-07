"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SeedCollection } from "@/lib/cms/types";
import { Editable } from "@/components/cms/editable";
import {
  useCollectionItems,
  ItemControls,
  AddItem,
} from "@/components/cms/collection-editor";

export function FAQ({ seed }: { seed: SeedCollection }) {
  const [open, setOpen] = useState<number | null>(0);
  const { editing, items } = useCollectionItems(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;

  return (
    <>
      <div className="mx-auto max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white card-shadow">
        {items.map((item, i) => {
          const isOpen = editing || open === i;
          return (
            <div key={item._id} className={editing ? "cms-item cms-on relative" : ""}>
              {editing && (
                <ItemControls
                  seed={seed}
                  currentIds={ids}
                  item={item}
                  index={i}
                  total={items.length}
                />
              )}
              <button
                onClick={() => !editing && setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50 sm:px-8"
              >
                <Editable
                  bind={{ loc, itemId: item._id, field: "q" }}
                  className="font-display text-lg font-semibold text-foreground"
                >
                  {item.fields.q}
                </Editable>
                {!editing && (
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-blue to-navy text-white"
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.span>
                )}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <Editable
                      as="p"
                      bind={{ loc, itemId: item._id, field: "a" }}
                      className="px-6 pb-6 text-muted sm:px-8"
                    >
                      {item.fields.a}
                    </Editable>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        <AddItem
          seed={seed}
          currentIds={ids}
          label="Add question"
          fields={() => ({ q: "New question?", a: "New answer." })}
        />
      </div>
    </>
  );
}
