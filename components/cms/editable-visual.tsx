"use client";

import Image from "next/image";
import { useCMS } from "./edit-context";
import { ImageOverlay, isUpload } from "./editable-image";
import type { ReactNode } from "react";

/* Wraps a decorative/3D visual block so the owner can replace it with an image
   from the asset library (and revert to the original visual). Bound to a scalar
   that holds the chosen image URL ("" = show the original visual). */
export function EditableVisual({
  id,
  children,
  className,
  alt = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
  alt?: string;
}) {
  const cms = useCMS();
  const url = cms ? cms.getScalar(id, "") : "";

  // View mode: image override if set, else the original visual (3D etc.).
  if (!cms?.editMode) {
    if (url) {
      return (
        <div className={className ?? "relative"}>
          <Image src={url} alt={alt} fill className="object-cover rounded-[inherit]" unoptimized={isUpload(url)} />
        </div>
      );
    }
    return <>{children}</>;
  }

  // Edit mode with an image set: show it + overlay to change, plus revert.
  if (url) {
    return (
      <div className={className ?? "relative"}>
        <Image src={url} alt={alt} fill className="object-cover rounded-[inherit]" unoptimized={isUpload(url)} />
        <ImageOverlay current={url} onCommit={(u) => cms.setScalar(id, u)} />
        <button
          type="button"
          className="cms-image-badge"
          style={{ top: "auto", bottom: 8, right: 8 }}
          onClick={() => cms.setScalar(id, "")}
          title="Revert to the original visual"
        >
          ↺ Use original
        </button>
      </div>
    );
  }

  // Edit mode, no override: show the original visual with a "replace" affordance.
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      <button
        type="button"
        className="cms-image-badge"
        onClick={async () => {
          const picked = await cms.pickMedia("image");
          if (picked) cms.setScalar(id, picked);
        }}
        title="Replace this visual with an image"
      >
        🖼 Replace visual
      </button>
    </div>
  );
}
