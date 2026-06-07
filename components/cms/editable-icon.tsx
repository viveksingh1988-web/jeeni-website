"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCMS } from "./edit-context";
import { Icon, ICON_NAMES } from "@/lib/cms/icons";
import type { Locator } from "@/lib/cms/mutate";

type Bind =
  | { scalarId: string }
  | { loc: Locator; itemId: string; field: string };

/* An editable icon. View mode renders the chosen icon; edit mode shows a picker
   (rendered in a portal so it's never clipped by overflow-hidden parents, and
   never triggers a parent link). */
export function EditableIcon({
  bind,
  fallback,
  className,
}: {
  bind: Bind;
  fallback: string;
  className?: string;
}) {
  const cms = useCMS();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  let name = fallback;
  if (cms) {
    if ("scalarId" in bind) name = cms.getScalar(bind.scalarId, fallback);
    else {
      const collId = bind.loc.kind === "top" ? bind.loc.id : bind.loc.parentId;
      const coll = cms.doc.collections[collId];
      const stored =
        bind.loc.kind === "top"
          ? coll?.items?.[bind.itemId]?.fields?.[bind.field]
          : coll?.items?.[bind.loc.itemId]?.children?.[bind.loc.childKey]?.items?.[
              bind.itemId
            ]?.fields?.[bind.field];
      name = stored || fallback;
    }
  }

  function commit(n: string) {
    if (!cms) return;
    if ("scalarId" in bind) cms.setScalar(bind.scalarId, n);
    else cms.setItemField(bind.loc, bind.itemId, bind.field, n);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!cms?.editMode) return <Icon name={name} className={className} />;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="cms-icon-edit"
        title="Change icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const r = btnRef.current?.getBoundingClientRect();
          if (r) setPos({ top: r.bottom + 6, left: r.left });
          setOpen((o) => !o);
        }}
      >
        <Icon name={name} className={className} />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="cms-icon-picker"
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {ICON_NAMES.map((n) => (
              <button
                key={n}
                type="button"
                className={`cms-icon-opt ${n === name ? "cms-icon-opt-on" : ""}`}
                title={n}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  commit(n);
                }}
              >
                <Icon name={n} className="h-5 w-5" />
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
