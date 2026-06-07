"use client";

import { useState, useCallback, useMemo, useSyncExternalStore } from "react";
import { useCMS } from "./edit-context";
import { PALETTE, PALETTE_CATEGORIES, type PaletteItem } from "@/lib/cms/palette";
import { subscribeActivePage, snapshotActivePage } from "@/lib/cms/active-page-store";

/* Module-level trigger so EditBar can open without prop drilling */
let _open: (() => void) | null = null;
export function openComponentPicker() {
  _open?.();
}

export function ComponentPicker() {
  const cms = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<string | null>(null);

  _open = () => { setIsOpen(true); setAdded(null); setQuery(""); };

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setAdded(null);
  };

  // Read which PageBlocks instance is currently on screen (registered by
  // PageBlocks itself via the active-page-store). Works for both site.pages
  // (custom pages) and site.extras (built-in pages like home/services).
  const activePage = useSyncExternalStore(
    subscribeActivePage,
    snapshotActivePage,
    () => null
  );

  const addToPage = useCallback((item: PaletteItem) => {
    if (!cms || !activePage) return;
    const { loc, getBlockIds } = activePage;
    const newId = cms.addItem(loc, getBlockIds(), item.fields());
    setAdded(item.label);
    // Close quickly then scroll to the new block so the user can see it.
    setTimeout(() => {
      setAdded(null);
      close();
      requestAnimationFrame(() => {
        const el = document.getElementById(`cms-block-${newId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 600);
  }, [cms, activePage]);

  // Filter palette by query (label, category, desc)
  const filtered = useMemo(() => {
    if (!query.trim()) return null; // null = show all categories
    const q = query.toLowerCase();
    return PALETTE.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
    );
  }, [query]);

  if (!cms?.isAdmin || !cms.editMode) return null;

  const draftLoading = !!cms.draftLoading;
  const notOnCustomPage = !activePage && !draftLoading;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[130] bg-black/20 backdrop-blur-[2px]"
          onClick={close}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed right-0 top-0 z-[140] flex h-screen w-full max-w-[480px] flex-col bg-surface shadow-2xl border-l border-border transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              Add a section
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {activePage
                ? `Adding to: ${activePage.label || "/"}`
                : draftLoading
                  ? "Loading draft…"
                  : "Navigate to an editable page first"}
            </p>
          </div>
          <button
            onClick={close}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-border px-5 py-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections… (hero, pricing, FAQ…)"
            className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none focus:border-blue/50 focus:bg-surface"
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* Draft loading state */}
          {draftLoading && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted">
              <p className="font-semibold">Loading draft…</p>
              <p className="mt-1 text-xs">Sections will be available in a moment.</p>
            </div>
          )}

          {/* Warning: not on a page that has a block editing slot */}
          {notOnCustomPage && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <p className="font-semibold">Navigate to an editable page first</p>
              <p className="mt-1 text-xs">Go to the home page, a custom page, or any page with an editable area, then re-open this panel.</p>
            </div>
          )}

          {/* Success flash */}
          {added && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue/20 bg-blue/5 px-4 py-3 text-sm text-blue">
              <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
              <span><b>{added}</b> added to the page</span>
            </div>
          )}

          {/* Results */}
          {filtered ? (
            /* Search results */
            filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">No sections match &ldquo;{query}&rdquo;</p>
            ) : (
              <div className="space-y-2">
                {filtered.map((item) => (
                  <SectionCard key={item.type} item={item} onAdd={addToPage} disabled={notOnCustomPage || draftLoading} />
                ))}
              </div>
            )
          ) : (
            /* All sections grouped by category */
            PALETTE_CATEGORIES.map((cat) => {
              const items = PALETTE.filter((p) => p.category === cat);
              return (
                <div key={cat} className="mb-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted">{cat}</p>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <SectionCard key={item.type} item={item} onAdd={addToPage} disabled={notOnCustomPage || draftLoading} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

function SectionCard({
  item,
  onAdd,
  disabled,
}: {
  item: PaletteItem;
  onAdd: (item: PaletteItem) => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onAdd(item)}
      className="group flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-blue/30 hover:bg-blue/5 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground group-hover:text-blue transition-colors">
          {item.label}
        </p>
        <p className="mt-0.5 text-xs text-muted truncate">{item.desc}</p>
      </div>
      <svg className="h-4 w-4 flex-none text-muted group-hover:text-blue transition-colors" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
      </svg>
    </button>
  );
}
