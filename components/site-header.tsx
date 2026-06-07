"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { ScrollProgress } from "./scroll-progress";
import { SmoothScroll } from "./smooth-scroll";

const HIDE_ON = ["/studio"];

/** Site header + scroll utilities — hidden on auth-only routes like /studio. */
export function SiteHeader() {
  const path = usePathname();
  if (HIDE_ON.includes(path)) return null;
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
    </>
  );
}
