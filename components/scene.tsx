"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Variant } from "./scene-3d";

// Loaded as a code-split chunk and mounted only on the client (after mount),
// so it never SSRs (no WebGL on the server) — without next/dynamic ssr:false,
// which would otherwise "bail out to client-side rendering" during SSR.
const Scene3D = dynamic(() => import("./scene-3d").then((m) => m.Scene3D));

/* Decorative WebGL layer for page heroes. Pass a positioning className. */
export function Scene({
  variant,
  className = "",
  interactive = false,
}: {
  variant: Variant;
  className?: string;
  interactive?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div aria-hidden className={className}>
      {mounted && <Scene3D variant={variant} interactive={interactive} />}
    </div>
  );
}
