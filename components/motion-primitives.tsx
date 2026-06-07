"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* A library of distinct scroll-entrance animations. Assign a different
   `variant` to each section so scrolling feels like flipping through a book. */
export type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "zoom"
  | "blur"
  | "rotate"
  | "flip"
  | "flipUp"
  | "clip"
  | "skew"
  | "swing";

const VARIANTS: Record<RevealVariant, Variants> = {
  up: { hidden: { opacity: 0, y: 44 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -44 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -80 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 80 }, show: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.82 }, show: { opacity: 1, scale: 1 } },
  blur: {
    hidden: { opacity: 0, y: 24, filter: "blur(16px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -6, y: 48 },
    show: { opacity: 1, rotate: 0, y: 0 },
  },
  flip: { hidden: { opacity: 0, rotateX: -78 }, show: { opacity: 1, rotateX: 0 } },
  flipUp: { hidden: { opacity: 0, rotateX: 78 }, show: { opacity: 1, rotateX: 0 } },
  clip: {
    hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    show: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
  },
  skew: {
    hidden: { opacity: 0, skewY: 7, y: 46 },
    show: { opacity: 1, skewY: 0, y: 0 },
  },
  swing: {
    hidden: { opacity: 0, rotateY: -55, x: 60 },
    show: { opacity: 1, rotateY: 0, x: 0 },
  },
};

/* Scroll-triggered reveal. Default = gentle directional offset; pass a
   `variant` for a distinct entrance (flip, blur, clip, swing, …). */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  className?: string;
  variant?: RevealVariant;
  origin?: string;
  duration?: number;
};

export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  once = false,
  className,
  variant,
  origin = "center top",
  duration = 0.75,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const is3D = variant === "flip" || variant === "flipUp" || variant === "swing";
  const v: Variants = variant
    ? VARIANTS[variant]
    : { hidden: { opacity: 0, y, x }, show: { opacity: 1, y: 0, x: 0 } };

  return (
    <div className={className} style={is3D ? { perspective: 1300 } : undefined}>
      <motion.div
        variants={v}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.25 }}
        transition={{ duration, ease: EASE, delay }}
        style={
          is3D ? { transformOrigin: origin, transformStyle: "preserve-3d" } : undefined
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Single-element 3D reveal — rotates up from the page on scroll. */
export function Reveal3D({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: -22 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.85, ease: EASE, delay }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Stagger container — children animate in sequence */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -18 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export function Stagger({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      style={{ perspective: 1200 }}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLMotionProps<"div">) {
  return (
    <motion.div className={className} variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
}

/* Word-by-word animated heading */
export function AnimatedHeading({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.8, ease: EASE },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}
