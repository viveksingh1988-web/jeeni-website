import type { ReactNode } from "react";
import { EditableSection } from "@/components/cms/editable-section";

/* Small pill label above section headings */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue">
      <span className="h-1.5 w-1.5 rounded-full bg-blue animate-pulse-soft" />
      {children}
    </span>
  );
}

export function SectionShell({
  children,
  className = "",
  id,
  cmsId,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  /** When set, the section becomes removable in the CMS editor. */
  cmsId?: string;
}) {
  const section = (
    <section id={id} className={`relative mx-auto max-w-7xl px-6 ${className}`}>
      {children}
    </section>
  );
  if (cmsId) return <EditableSection id={cmsId}>{section}</EditableSection>;
  return section;
}
