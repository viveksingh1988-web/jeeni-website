"use client";

import type { ReactNode } from "react";
import { useCMS } from "./edit-context";
import { AnimatedHeading } from "@/components/motion-primitives";
import { TextReveal } from "@/components/text-reveal";
import { Editable } from "./editable";

/* The hero's per-letter animated heading. In view mode it animates the resolved
   value; in edit mode it becomes a plain editable heading (no per-letter split,
   so the caret behaves). */
export function EditableHeading({
  id,
  text,
  className,
  delay = 0,
}: {
  id: string;
  text: string;
  className?: string;
  delay?: number;
}) {
  const cms = useCMS();
  const value = cms ? cms.getScalar(id, text) : text;

  if (cms?.editMode) {
    return (
      <Editable as="h1" id={id} className={className}>
        {value}
      </Editable>
    );
  }
  return <AnimatedHeading text={value} className={className} delay={delay} />;
}

/* An animated stat figure (StatCounter). Keeps the count-up animation until the
   owner edits it; once overridden it renders the static edited text. */
export function EditableStat({
  id,
  text,
  children,
  className,
}: {
  id: string;
  /** The default figure as a string, e.g. "$2.4M", "20+", "312%". */
  text: string;
  /** The animated default (a <StatCounter/>). */
  children: ReactNode;
  className?: string;
}) {
  const cms = useCMS();
  const value = cms ? cms.getScalar(id, text) : text;

  if (cms?.editMode) {
    return (
      <Editable id={id} className={className}>
        {text}
      </Editable>
    );
  }
  if (value !== text) return <span className={className}>{value}</span>;
  return <span className={className}>{children}</span>;
}

/* Scroll-linked reveal statement; plain editable text while editing. */
export function EditableTextReveal({
  id,
  text,
  className,
}: {
  id: string;
  text: string;
  className?: string;
}) {
  const cms = useCMS();
  const value = cms ? cms.getScalar(id, text) : text;

  if (cms?.editMode) {
    return (
      <Editable
        as="p"
        id={id}
        className={`${className ?? ""} text-2xl font-display font-semibold leading-snug sm:text-3xl`}
      >
        {value}
      </Editable>
    );
  }
  return <TextReveal text={value} className={className} />;
}
