"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/* Scroll-linked text reveal — each word fills from faint to solid as the
   section scrolls through the viewport (Aceternity / 21st.dev style). */
export function TextReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      <p className="flex flex-wrap font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]} reduce={!!reduce}>
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  reduce,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="relative mr-[0.28em] mt-2">
      <span className="absolute opacity-15">{children}</span>
      <motion.span style={{ opacity: reduce ? 1 : opacity }}>
        {children}
      </motion.span>
    </span>
  );
}
