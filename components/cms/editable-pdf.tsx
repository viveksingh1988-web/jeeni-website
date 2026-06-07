"use client";

import type { ReactNode } from "react";
import { PdfButton, PdfCardTrigger, PdfReader } from "@/components/pdf-viewer";
import { useCMS } from "./edit-context";

/* PDF controls whose source document is editable. The owner can swap the PDF
   from the asset library (pick a PDF) — bound to a scalar holding the URL. */

function useResolvedPdf(id: string, fallback: string) {
  const cms = useCMS();
  const src = cms ? cms.getScalar(id, fallback) : fallback;
  async function change() {
    if (!cms) return;
    const url = await cms.pickMedia("pdf");
    if (url) cms.setScalar(id, url);
  }
  return { cms, src, change };
}

export function EditablePdfButton({
  id,
  src,
  title,
  children,
}: {
  id: string;
  src: string;
  title: string;
  children: ReactNode;
}) {
  const { src: resolved } = useResolvedPdf(id, src);
  return (
    <PdfButton src={resolved} title={title}>
      {children}
    </PdfButton>
  );
}

export function EditablePdfReader({
  id,
  src,
  title,
}: {
  id: string;
  src: string;
  title: string;
}) {
  const { cms, src: resolved, change } = useResolvedPdf(id, src);
  return (
    <div className="relative">
      <PdfReader src={resolved} title={title} />
      {cms?.editMode && (
        <button type="button" className="cms-image-badge" onClick={change}>
          📄 Change PDF
        </button>
      )}
    </div>
  );
}

export function EditablePdfCardTrigger({
  id,
  src,
  title,
  className,
  children,
}: {
  id: string;
  src: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const { cms, src: resolved, change } = useResolvedPdf(id, src);
  return (
    <div className="relative">
      <PdfCardTrigger src={resolved} title={title} className={className}>
        {children}
      </PdfCardTrigger>
      {cms?.editMode && (
        <button
          type="button"
          className="cms-image-badge"
          style={{ top: 8, left: 8, right: "auto" }}
          onClick={change}
        >
          📄 Change PDF
        </button>
      )}
    </div>
  );
}
