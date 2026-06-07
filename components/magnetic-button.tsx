"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { useCMS } from "@/components/cms/edit-context";

type Variant = "primary" | "ghost";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** When set, the link target becomes editable in the CMS (a 🔗 control). */
  hrefId?: string;
};

const MotionLink = motion.create(Link);

/* Button with a subtle magnetic pull toward the cursor.
   Internal links use Next.js client-side navigation (with prefetch);
   external links (http...) open in a new tab. */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  hrefId,
}: Props) {
  const cms = useCMS();
  const resolvedHref = hrefId && cms ? cms.getScalar(hrefId, href) : href;
  const editingHref = !!(cms?.editMode && hrefId);
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 will-change-transform";

  const styles =
    variant === "primary"
      ? "text-white bg-gradient-to-r from-blue via-blue-bright to-navy shadow-[0_10px_30px_-10px_rgba(3,105,161,0.45)] hover:shadow-[0_14px_40px_-10px_rgba(15,23,42,0.3)]"
      : "text-foreground border border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400";

  // Open external URLs and static file assets (e.g. PDFs) in a new tab
  // instead of routing them through the client-side router.
  const isExternal =
    /^https?:\/\//.test(resolvedHref) ||
    /\.(pdf|zip|docx?|xlsx?|pptx?|csv)(\?|#|$)/i.test(resolvedHref);
  const sharedProps = {
    ref,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: { x: sx, y: sy },
    whileTap: { scale: 0.96 },
    onClick: (e: MouseEvent) => {
      if (cms?.editMode) e.preventDefault();
    },
    className: `${base} ${styles} ${className}`,
  };
  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <ArrowIcon />
    </>
  );

  const link = isExternal ? (
    <motion.a {...sharedProps} href={resolvedHref} target="_blank" rel="noopener noreferrer">
      {inner}
    </motion.a>
  ) : (
    <MotionLink {...sharedProps} href={resolvedHref}>
      {inner}
    </MotionLink>
  );

  if (!editingHref) return link;

  // Edit mode: show a control to change the link target.
  return (
    <span className="relative inline-flex">
      {link}
      <button
        type="button"
        className="cms-link-edit"
        title={`Edit link (currently ${resolvedHref})`}
        onClick={() => {
          const v = window.prompt("Link target (URL or /path)", resolvedHref);
          if (v != null) cms!.setScalar(hrefId!, v);
        }}
      >
        🔗
      </button>
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
