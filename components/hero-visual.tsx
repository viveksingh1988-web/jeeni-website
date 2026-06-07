"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { StatCounter } from "./stat-counter";
import { EditableVisual } from "@/components/cms/editable-visual";
import { EditableStat } from "@/components/cms/editable-heading";
import { Editable } from "@/components/cms/editable";

const EASE = [0.22, 1, 0.36, 1] as const;

const Glow = () => (
  <div className="absolute inset-6 animate-pulse-soft rounded-full bg-gradient-to-br from-blue/20 to-gold/20 blur-2xl" />
);

// Code-split + client-only via a mount gate (no ssr:false → no SSR bailout).
const Hero3D = dynamic(() => import("./hero-3d").then((m) => m.Hero3D), {
  loading: Glow,
});

/* Interactive WebGL hero — a mouse-reactive 3D crystal with floating live
   metric cards. Always rendered so the 3D is visible for everyone. */
export function HeroVisual() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      {/* soft brand glow */}
      <div className="absolute inset-10 rounded-full bg-gradient-to-br from-blue/15 to-gold/15 blur-3xl" />

      <EditableVisual
        id="home.hero.visual"
        alt="Jeeni hero visual"
        className="absolute inset-0 rounded-full"
      >
        <div className="absolute inset-0">
          {mounted ? <Hero3D /> : <Glow />}
        </div>
      </EditableVisual>

      {/* Floating: Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
        className="absolute -left-2 top-8 z-10"
      >
        <div className="glass-strong animate-float rounded-2xl px-5 py-4">
          <Editable as="p" id="home.hero.stat1.label" className="text-xs font-medium text-muted">
            Revenue tracked
          </Editable>
          <p className="font-display text-2xl font-bold text-gradient">
            <EditableStat id="home.hero.stat1.value" text="$2.4M">
              <StatCounter prefix="$" value={2.4} decimals={1} suffix="M" />
            </EditableStat>
          </p>
        </div>
      </motion.div>

      {/* Floating: Hours reclaimed */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
        className="absolute -right-3 top-1/3 z-10"
      >
        <div
          className="glass-strong animate-float rounded-2xl px-5 py-4"
          style={{ animationDelay: "-2s" }}
        >
          <Editable as="p" id="home.hero.stat2.label" className="text-xs font-medium text-muted">
            Hours / week
          </Editable>
          <p className="font-display text-2xl font-bold text-blue">
            <EditableStat id="home.hero.stat2.value" text="20+">
              <StatCounter value={20} suffix="+" />
            </EditableStat>
          </p>
        </div>
      </motion.div>

      {/* Floating: ROI */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7, ease: EASE }}
        className="absolute bottom-6 left-4 z-10"
      >
        <div
          className="glass-strong animate-float rounded-2xl px-5 py-4"
          style={{ animationDelay: "-4s" }}
        >
          <Editable as="p" id="home.hero.stat3.label" className="text-xs font-medium text-muted">
            Measured ROI
          </Editable>
          <p className="font-display text-2xl font-bold text-gold">
            <EditableStat id="home.hero.stat3.value" text="312%">
              <StatCounter value={312} suffix="%" />
            </EditableStat>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
