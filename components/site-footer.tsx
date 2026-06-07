"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { CookieBanner } from "./cookie-banner";

const HIDE_ON = ["/studio"];

/** Site footer + cookie banner — suppressed server-side on /studio via the
 *  root layout (middleware stamps x-current-path); this client guard is the
 *  belt-and-suspenders for client-side navigation. */
export function SiteFooter() {
  const path = usePathname();
  if (HIDE_ON.includes(path)) return null;
  return (
    <>
      <Footer />
      <CookieBanner />
    </>
  );
}
