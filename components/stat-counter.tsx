"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  motion,
  type MotionValue,
} from "motion/react";

/* Counts up to `value` when scrolled into view. */
export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.6 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(
          latest.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        );
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function SpringFill({ value }: { value: MotionValue<number> }) {
  const widthPct = useTransform(value, (v) => `${v}%`);
  return (
    <motion.div
      style={{ width: widthPct }}
      className="h-full rounded-full bg-gradient-to-r from-blue via-blue-bright to-gold"
    />
  );
}

/* Thin animated progress bar that fills when in view */
export function ProgressBar({ to }: { to: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.8 });
  const width = useMotionValue(0);
  const sw = useSpring(width, { stiffness: 60, damping: 18 });

  useEffect(() => {
    width.set(inView ? to : 0);
  }, [inView, to, width]);

  return (
    <div ref={ref} className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <SpringFill value={sw} />
    </div>
  );
}
