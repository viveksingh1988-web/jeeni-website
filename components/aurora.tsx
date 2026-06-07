"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/* Professional light backdrop whose soft brand tints drift at different
   rates as you scroll — a parallax depth cue behind every page. */
export function Aurora({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const yA = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yGrid = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <motion.div
        style={{ y: reduce ? 0 : yA }}
        className="absolute -left-24 -top-28 h-[30rem] w-[30rem] rounded-full bg-blue/10 blur-[130px]"
      />
      <motion.div
        style={{ y: reduce ? 0 : yB }}
        className="absolute -top-10 right-0 h-[24rem] w-[24rem] rounded-full bg-gold/10 blur-[130px]"
      />
      <motion.div
        style={{ y: reduce ? 0 : yGrid }}
        className="absolute inset-0 grid-bg opacity-70"
      />
    </div>
  );
}
