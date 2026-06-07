"use client";

import { useCMS } from "./edit-context";
import type { ReactNode } from "react";

/* Wraps a page section so the owner can remove it. When removed, it renders
   nothing in the published view, so surrounding spacing/margins collapse
   naturally. In edit mode a removed section stays visible (dimmed) with a
   Restore control so it can be brought back. */
export function EditableSection({
  id,
  children,
  label = "section",
}: {
  id: string;
  children: ReactNode;
  label?: string;
}) {
  const cms = useCMS();
  const hidden = cms ? cms.isHidden(id) : false;

  // Published / non-edit view: removed → render nothing (spacing collapses).
  if (!cms?.editMode) {
    if (hidden) return null;
    return <>{children}</>;
  }

  // Edit mode: show the section with a control bar; dim it when removed.
  return (
    <div className={`cms-section ${hidden ? "cms-section-removed" : ""}`}>
      <div className="cms-section-bar" contentEditable={false}>
        <span className="cms-section-tag">{label}</span>
        {hidden ? (
          <button
            type="button"
            className="cms-section-btn"
            onClick={() => cms.setHidden(id, false)}
          >
            ↺ Restore section
          </button>
        ) : (
          <button
            type="button"
            className="cms-section-btn cms-section-btn-danger"
            onClick={() => cms.setHidden(id, true)}
          >
            ✕ Remove section
          </button>
        )}
      </div>
      <div className={hidden ? "pointer-events-none select-none opacity-40" : ""}>
        {children}
      </div>
    </div>
  );
}
