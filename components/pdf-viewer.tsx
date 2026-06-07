"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- Shared modal that renders a PDF inline (never a new tab) ---------- */
function PdfModal({
  src,
  title,
  open,
  onClose,
}: {
  src: string;
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8"
          style={{ perspective: 1600 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, y: 40, rotateX: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl glass-strong shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-3.5">
              <p className="truncate font-display text-sm font-semibold sm:text-base">
                {title}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={src}
                  download
                  className="rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground"
                >
                  Download
                </a>
                <button
                  onClick={onClose}
                  aria-label="Close reader"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-muted transition-colors hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>
            <iframe
              src={`${src}#view=FitH`}
              title={title}
              className="h-full w-full flex-1 bg-white"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Pill button that opens the inline reader ---------- */
export function PdfButton({
  src,
  title,
  children,
  variant = "primary",
}: {
  src: string;
  title: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const styles =
    variant === "primary"
      ? "text-white bg-gradient-to-r from-blue via-blue-bright to-navy shadow-[0_10px_30px_-10px_rgba(3,105,161,0.45)] hover:shadow-[0_14px_40px_-10px_rgba(15,23,42,0.3)]"
      : "text-foreground border border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400";

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 ${styles}`}
      >
        {children}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </motion.button>
      <PdfModal src={src} title={title} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ---------- Arbitrary clickable wrapper (e.g. a document card) ---------- */
export function PdfCardTrigger({
  src,
  title,
  className = "",
  children,
}: {
  src: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block w-full cursor-pointer text-left ${className}`}
      >
        {children}
      </button>
      <PdfModal src={src} title={title} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ---------- Always-on inline reader embedded in a page ---------- */
export function PdfReader({ src, title }: { src: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="glow-ring overflow-hidden rounded-3xl border border-slate-200 glass-strong"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-3.5">
        <p className="truncate font-display text-sm font-semibold">{title}</p>
        <a
          href={src}
          download
          className="rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground"
        >
          Download PDF
        </a>
      </div>
      <iframe
        src={`${src}#view=FitH`}
        title={title}
        className="h-[78vh] w-full bg-white"
      />
    </motion.div>
  );
}
