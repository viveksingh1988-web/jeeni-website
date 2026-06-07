"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useCMS } from "./edit-context";
import type { Locator } from "@/lib/cms/mutate";

type Bind =
  | { scalarId: string }
  | { loc: Locator; itemId: string; field: string };

export function isUpload(url: string) {
  return url.startsWith("/api/media/");
}

/** Upload an image file to the media store, returning its served URL. */
export async function uploadMedia(token: string, file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/media", {
    method: "POST",
    headers: { "x-cms-token": token },
    body: fd,
  });
  const j = await res.json();
  if (!res.ok || !j.url) throw new Error(j.error || `HTTP ${res.status}`);
  return j.url as string;
}

/** Overlay with an always-visible badge + hover actions: pick from the asset
 *  library, upload, or paste a URL. Used by every editable image. */
export function ImageOverlay({
  current,
  onCommit,
}: {
  current: string;
  onCommit: (url: string) => void;
}) {
  const cms = useCMS();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  async function onPick(file: File) {
    if (!cms) return;
    setBusy(true);
    try {
      onCommit(await uploadMedia(cms.token, file));
      setOpen(false);
    } catch (e) {
      alert("Upload failed: " + String(e));
    } finally {
      setBusy(false);
    }
  }

  async function fromLibrary() {
    if (!cms) return;
    setOpen(false);
    const url = await cms.pickMedia("image");
    if (url) onCommit(url);
  }

  // The overlay container has NO pointer events, so text layered above a
  // background image stays clickable/editable. Only the small badge + popover
  // are interactive.
  return (
    <div className="cms-image-overlay" contentEditable={false}>
      <button
        type="button"
        className="cms-image-badge"
        title="Change image"
        onClick={() => setOpen((o) => !o)}
      >
        🖼 Edit image
      </button>
      {open && (
        <div className="cms-image-menu">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
          />
          <button type="button" className="cms-image-mi" onClick={fromLibrary}>
            🗂 Asset library
          </button>
          <button
            type="button"
            className="cms-image-mi"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            {busy ? "Uploading…" : "⤓ Upload new"}
          </button>
          <button
            type="button"
            className="cms-image-mi"
            onClick={() => {
              const url = window.prompt("Image URL", current);
              if (url != null) onCommit(url);
              setOpen(false);
            }}
          >
            🔗 Paste URL
          </button>
        </div>
      )}
    </div>
  );
}

type Props = {
  /** Default/published src, resolved on the server. */
  src: string;
  alt: string;
  /** Binding for edit mode (where to write the new url). */
  bind: Bind;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

export function EditableImage({
  src,
  alt,
  bind,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: Props) {
  const cms = useCMS();

  // In edit mode show the live draft value; otherwise the server-resolved src.
  let current = src;
  if (cms?.editMode) {
    if ("scalarId" in bind) current = cms.getScalar(bind.scalarId, src);
    else {
      const collId = bind.loc.kind === "top" ? bind.loc.id : bind.loc.parentId;
      const coll = cms.doc.collections[collId];
      const stored =
        bind.loc.kind === "top"
          ? coll?.items?.[bind.itemId]?.fields?.[bind.field]
          : coll?.items?.[bind.loc.itemId]?.children?.[bind.loc.childKey]?.items?.[
              bind.itemId
            ]?.fields?.[bind.field];
      current = stored ?? src;
    }
  }

  function commit(url: string) {
    if (!cms) return;
    if ("scalarId" in bind) cms.setScalar(bind.scalarId, url);
    else cms.setItemField(bind.loc, bind.itemId, bind.field, url);
  }

  const img = (
    <Image
      src={current}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      unoptimized={isUpload(current)}
    />
  );

  if (!cms?.editMode) return img;

  if (fill) {
    return (
      <>
        {img}
        <ImageOverlay current={current} onCommit={commit} />
      </>
    );
  }

  return (
    <span className="cms-image-wrap inline-block">
      {img}
      <ImageOverlay current={current} onCommit={commit} />
    </span>
  );
}
