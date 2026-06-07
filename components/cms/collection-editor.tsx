"use client";

import { useCMS } from "./edit-context";
import type { SeedCollection, ResolvedItem } from "@/lib/cms/types";
import type { Locator } from "@/lib/cms/mutate";
import { resolveCollection } from "@/lib/cms/merge";
import type { ReactNode } from "react";

/** Resolve a collection from the active doc (published when viewing, draft when
 *  editing). Works for SSR and edit mode alike. */
export function useCollectionItems(seed: SeedCollection): {
  editing: boolean;
  items: ResolvedItem[];
} {
  const cms = useCMS();
  const editing = !!cms?.editMode;
  const items = cms ? cms.resolve(seed) : resolveCollection(undefined, seed);
  return { editing, items };
}

function topLoc(seed: SeedCollection | undefined, loc?: Locator): Locator {
  if (loc) return loc;
  if (seed) return { kind: "top", id: seed.id };
  throw new Error("ItemControls/AddItem need either `seed` or `loc`");
}

/** Up / down / delete cluster, shown on hover over an item in edit mode. */
export function ItemControls({
  seed,
  loc,
  currentIds,
  item,
  index,
  total,
  children,
}: {
  seed?: SeedCollection;
  loc?: Locator;
  currentIds: string[];
  item: ResolvedItem;
  index: number;
  total: number;
  /** Extra control buttons (e.g. edit-URL) rendered inside the cluster. */
  children?: ReactNode;
}) {
  const cms = useCMS();
  if (!cms?.editMode) return null;
  const _loc = topLoc(seed, loc);
  return (
    <div className="cms-controls" contentEditable={false}>
      {children}
      <button
        type="button"
        className="cms-ctl"
        title="Move up"
        disabled={index === 0}
        onClick={() => cms.moveItem(_loc, currentIds, item._id, -1)}
      >
        ↑
      </button>
      <button
        type="button"
        className="cms-ctl"
        title="Move down"
        disabled={index === total - 1}
        onClick={() => cms.moveItem(_loc, currentIds, item._id, 1)}
      >
        ↓
      </button>
      <button
        type="button"
        className="cms-ctl"
        title="Duplicate"
        onClick={() => cms.duplicateItem(_loc, currentIds, item._id)}
      >
        ⎘
      </button>
      <button
        type="button"
        className="cms-ctl cms-ctl-danger"
        title="Delete"
        onClick={() => {
          if (window.confirm("Delete this item?"))
            cms.removeItem(_loc, currentIds, item._id, item.seed);
        }}
      >
        ✕
      </button>
    </div>
  );
}

/** "Add item" button rendered beneath a collection in edit mode. */
export function AddItem({
  seed,
  loc,
  currentIds,
  fields,
  label,
  onAdded,
  className,
}: {
  seed?: SeedCollection;
  loc?: Locator;
  currentIds: string[];
  fields?: () => Record<string, string>;
  label: string;
  onAdded?: (id: string) => void;
  className?: string;
}) {
  const cms = useCMS();
  if (!cms?.editMode) return null;
  const _loc = topLoc(seed, loc);
  return (
    <button
      type="button"
      className={`cms-add ${className ?? ""}`}
      onClick={() => {
        const id = cms.addItem(_loc, currentIds, fields ? fields() : {});
        onAdded?.(id);
      }}
    >
      + {label}
    </button>
  );
}

/** Convenience wrapper that adds the hover outline + controls around an item.
 *  Use when an extra wrapping element is acceptable. */
export function CmsItem({
  editing,
  seed,
  loc,
  currentIds,
  item,
  index,
  total,
  as: Tag = "div",
  className,
  children,
}: {
  editing: boolean;
  seed: SeedCollection;
  loc?: Locator;
  currentIds: string[];
  item: ResolvedItem;
  index: number;
  total: number;
  as?: "div" | "li" | "article" | "section";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`${className ?? ""} ${editing ? "cms-item cms-on" : ""}`}>
      {editing && (
        <ItemControls
          seed={seed}
          loc={loc}
          currentIds={currentIds}
          item={item}
          index={index}
          total={total}
        />
      )}
      {children}
    </Tag>
  );
}
