"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Editable } from "@/components/cms/editable";
import { useCMS } from "@/components/cms/edit-context";
import { useCollectionItems } from "@/components/cms/collection-editor";
import { NAV_LINKS } from "@/lib/cms/seeds/nav";

export function Navbar() {
  const pathname = usePathname();
  if (pathname === "/studio") return null;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const cms = useCMS();
  const { editing, items } = useCollectionItems(NAV_LINKS);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`mt-3 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${
            scrolled
              ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
              : "bg-transparent"
          }`}
        >
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const href = item.fields.href || "/";
              const active = pathname === href;
              return (
                <Link
                  key={item._id}
                  href={href}
                  onClick={(e) => editing && e.preventDefault()}
                  className="group relative rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  {active && !editing && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white ring-1 ring-slate-200"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative ${active ? "text-foreground" : ""}`}>
                    {item.fields.label}
                  </span>
                </Link>
              );
            })}
            {editing && (
              <button
                type="button"
                onClick={cms?.openMenu}
                className="ml-1 rounded-full border border-dashed border-blue/50 px-3 py-1.5 text-xs font-semibold text-blue hover:bg-blue/5"
              >
                ✎ Edit menu
              </button>
            )}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/contact-us"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-blue-bright to-navy px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(3,105,161,0.4)] transition-transform hover:scale-[1.03]"
            >
              <Editable id="nav.cta">Calculate Your ROI</Editable>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white md:hidden"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <motion.span
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-foreground"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-5 bg-foreground"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-foreground"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl glass-strong p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={item.fields.href || "/"}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-muted hover:bg-slate-100 hover:text-foreground"
                  >
                    {item.fields.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/contact-us"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-gradient-to-r from-blue to-navy px-4 py-3 text-center text-base font-semibold text-white"
              >
                <Editable id="nav.cta">Calculate Your ROI</Editable>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue via-blue-bright to-gold"
      >
        <span className="text-lg font-bold text-white">J</span>
      </motion.div>
      <span className="font-display text-xl font-bold tracking-tight">
        <Editable id="brand.name">Jeeni</Editable>
      </span>
    </Link>
  );
}
