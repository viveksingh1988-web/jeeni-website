"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type MouseEvent } from "react";
import type { ResolvedPost } from "@/lib/blog-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Blog card with a true 3D perspective tilt:
   - rotates up into place on scroll (rotateX)
   - tilts toward the cursor on hover
   - inner layers float at different depths (translateZ)
   - cover image parallaxes against the tilt */
export function BlogCard3D({ post, index }: { post: ResolvedPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), {
    stiffness: 180,
    damping: 18,
  });

  // Image counter-parallax (moves opposite the tilt for depth)
  const imgX = useTransform(mx, [0, 1], ["6%", "-6%"]);
  const imgY = useTransform(my, [0, 1], ["6%", "-6%"]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -28 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
      style={{ perspective: 1200 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.03 }}
        className="glow-ring group relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white"
      >
        <Link href={`/what-we-do/f/${post.slug}`} className="block h-full">
          {/* Cover image with parallax */}
          <div className="relative h-52 overflow-hidden">
            <motion.div
              style={{ x: imgX, y: imgY, scale: 1.15 }}
              className="absolute inset-0"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                unoptimized={post.image.startsWith("/api/media/")}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <span
              style={{ transform: "translateZ(60px)" }}
              className="absolute left-4 top-4 rounded-full border border-slate-300 bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue backdrop-blur"
            >
              {post.category}
            </span>
          </div>

          {/* Text layer floats above the card */}
          <div
            style={{ transform: "translateZ(45px)" }}
            className="flex flex-col p-6"
          >
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <span>{post.readTime}</span>
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold leading-snug transition-colors group-hover:text-gradient">
              {post.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {post.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
              Read article
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
