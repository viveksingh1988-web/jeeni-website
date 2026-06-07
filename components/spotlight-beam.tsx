"use client";

import { motion } from "motion/react";

/* Aceternity / 21st.dev-style spotlight beam — a large soft diagonal light
   that sweeps in. Use inside a dark accent block. */
export function SpotlightBeam({
  className = "",
  fill = "#38bdf8",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <motion.svg
      aria-hidden
      initial={{ opacity: 0, x: "-12%", scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`pointer-events-none absolute z-0 ${className}`}
      width="700"
      height="1000"
      viewBox="0 0 700 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#spotlight-blur)">
        <ellipse
          cx="350"
          cy="160"
          rx="180"
          ry="420"
          transform="rotate(-28 350 160)"
          fill={fill}
          fillOpacity="0.22"
        />
      </g>
      <defs>
        <filter
          id="spotlight-blur"
          x="-300"
          y="-300"
          width="1300"
          height="1600"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="130" />
        </filter>
      </defs>
    </motion.svg>
  );
}
