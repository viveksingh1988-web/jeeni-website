"use client";

import { useEffect } from "react";
import { useCMS } from "./edit-context";
import { NAV_LINKS } from "@/lib/cms/seeds/nav";
import { FOOTER_ACTIONS } from "@/lib/cms/seeds/footer";
import type { SeedCollection } from "@/lib/cms/types";

/* Manage header + footer navigation links in one clean panel — no inline
   navbar overflow. */
export function MenuManager() {
  const cms = useCMS();
  const open = !!cms?.menuOpen;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cms?.closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cms]);

  if (!cms || !open) return null;

  return (
    <div className="cms-modal-backdrop" onClick={() => cms.closeMenu()}>
      <div className="cms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cms-modal-head">
          <h2 className="text-lg font-bold text-foreground">Navigation menus</h2>
          <button type="button" className="cms-btn-ghost" onClick={() => cms.closeMenu()}>✕</button>
        </div>
        <div className="cms-modal-body space-y-8">
          <LinkGroup title="Header menu" seed={NAV_LINKS} addLabel="New nav item" />
          <LinkGroup title="Footer links" seed={FOOTER_ACTIONS} addLabel="New footer link" />
        </div>
        <div className="cms-modal-foot">Reorder, rename, or relink. Remember to Publish.</div>
      </div>
    </div>
  );
}

function LinkGroup({ title, seed, addLabel }: { title: string; seed: SeedCollection; addLabel: string }) {
  const cms = useCMS()!;
  const items = cms.resolve(seed);
  const ids = items.map((i) => i._id);
  const loc = { kind: "top", id: seed.id } as const;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={it._id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2">
            <input
              value={it.fields.label ?? ""}
              onChange={(e) => cms.setItemField(loc, it._id, "label", e.target.value)}
              placeholder="Label"
              className="w-36 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue/60"
            />
            <input
              value={it.fields.href ?? ""}
              onChange={(e) => cms.setItemField(loc, it._id, "href", e.target.value)}
              placeholder="/path or https://…"
              className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue/60"
            />
            <button type="button" className="cms-ctl" title="Move up" disabled={i === 0}
              onClick={() => cms.moveItem(loc, ids, it._id, -1)}>↑</button>
            <button type="button" className="cms-ctl" title="Move down" disabled={i === items.length - 1}
              onClick={() => cms.moveItem(loc, ids, it._id, 1)}>↓</button>
            <button type="button" className="cms-ctl cms-ctl-danger" title="Delete"
              onClick={() => cms.removeItem(loc, ids, it._id, it.seed)}>✕</button>
          </li>
        ))}
      </ul>
      <button type="button" className="cms-add mt-3"
        onClick={() => cms.addItem(loc, ids, { label: "New link", href: "/" })}>
        + {addLabel}
      </button>
    </div>
  );
}
