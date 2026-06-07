"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useCMS } from "@/components/cms/edit-context";
import { ImageOverlay, isUpload } from "@/components/cms/editable-image";

/* A section block that behaves like a 3D layer: as it scrolls through the
   viewport it tilts on X, drifts vertically (parallax), and eases opacity.
   This is what makes every section feel like floating depth. */
export function Layer({
  children,
  className = "",
  tilt = 7,
  lift = 46,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [tilt, 0, -tilt * 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [lift, 0, -lift]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.85, 1],
    [0.55, 1, 1, 0.85]
  );

  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }}>
      <motion.div
        style={
          reduce
            ? undefined
            : { rotateX, y, opacity, transformStyle: "preserve-3d" }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Simple vertical parallax — element drifts at a different rate than scroll.
   Positive `speed` = moves slower (deeper); negative = faster (closer). */
export function Parallax({
  children,
  speed = 0.3,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 90, -speed * 90]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduce ? 0 : y }}>{children}</motion.div>
    </div>
  );
}

/* Image that drifts within its frame as it scrolls (depth + life). */
export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "object-cover",
  sizes,
  priority,
  editId,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Scalar CMS binding — makes the image editable/replaceable in edit mode. */
  editId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const cms = useCMS();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  const current = editId && cms ? cms.getScalar(editId, src) : src;
  const editing = !!(cms?.editMode && editId);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y: reduce ? 0 : y }}
        className="absolute inset-x-0 -inset-y-[14%]"
      >
        <Image
          src={current}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imgClassName}
          unoptimized={isUpload(current)}
        />
      </motion.div>
      {editing && (
        <ImageOverlay
          current={current}
          onCommit={(url) => cms!.setScalar(editId!, url)}
        />
      )}
    </div>
  );
}
