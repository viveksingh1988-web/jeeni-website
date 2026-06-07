"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { Editable } from "@/components/cms/editable";
import { useCMS } from "@/components/cms/edit-context";

/* Smoothly animated number that springs to its target on change. */
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 90, damping: 20 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduce) setDisplay(value);
    else spring.set(value);
  }, [value, spring, reduce]);

  useMotionValueEvent(spring, "change", (v) => setDisplay(v));

  return (
    <>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

function Slider({
  label,
  labelId,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  labelId: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Editable as="span" id={labelId} className="text-sm font-medium text-foreground/90">
          {label}
        </Editable>
        <span className="font-display text-lg font-bold text-blue">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full outline-none"
        style={{
          background: `linear-gradient(to right, var(--blue) ${pct}%, #e2e8f0 ${pct}%)`,
        }}
      />
    </div>
  );
}

const WORK_WEEKS = 48;

export function RoiCalculator() {
  const cms = useCMS();
  const [team, setTeam] = useState(25);
  const [hourly, setHourly] = useState(75);
  const [hours, setHours] = useState(8);

  const weeklyHours = team * hours;
  const annualHours = weeklyHours * WORK_WEEKS;
  const annualSavings = annualHours * hourly;
  // Illustrative ROI vs. a typical engagement baseline.
  const roiMultiple = Math.max(1, annualSavings / 60000);

  return (
    <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-7 card-shadow lg:grid-cols-2 lg:p-10">
      {/* Inputs */}
      <div className="flex flex-col gap-7">
        <div>
          <Editable as="h3" id="roi.heading" className="font-display text-2xl font-bold">
            Estimate your AI ROI
          </Editable>
          <Editable as="p" id="roi.desc" className="mt-2 text-sm text-muted">
            Drag the sliders. We&apos;ll show the value AI could reclaim for your
            team — the same way we measure it from day one.
          </Editable>
        </div>
        <Slider
          label="Team size"
          labelId="roi.slider.team"
          value={team}
          min={1}
          max={250}
          onChange={setTeam}
          format={(v) => `${v} people`}
        />
        <Slider
          label="Avg. loaded cost / hour"
          labelId="roi.slider.cost"
          value={hourly}
          min={30}
          max={250}
          step={5}
          onChange={setHourly}
          format={(v) => `$${v}`}
        />
        <Slider
          label="Hours reclaimed / person / week"
          labelId="roi.slider.hours"
          value={hours}
          min={1}
          max={20}
          onChange={setHours}
          format={(v) => `${v} hrs`}
        />
      </div>

      {/* Results */}
      <div className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br from-navy-deep to-navy p-7 text-white">
        <div>
          <Editable as="p" id="roi.result.label" className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Projected annual impact
          </Editable>
          <p className="mt-3 font-display text-5xl font-extrabold leading-none">
            <AnimatedNumber value={annualSavings} prefix="$" />
          </p>
          <Editable as="p" id="roi.result.sub" className="mt-2 text-sm text-white/70">
            estimated value reclaimed per year
          </Editable>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-display text-2xl font-bold text-gold-soft">
              <AnimatedNumber value={annualHours} suffix=" hrs" />
            </p>
            <Editable as="p" id="roi.result.hours" className="mt-1 text-xs text-white/70">reclaimed / year</Editable>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-display text-2xl font-bold text-gold-soft">
              <AnimatedNumber value={roiMultiple} decimals={1} suffix="x" />
            </p>
            <Editable as="p" id="roi.result.multiple" className="mt-1 text-xs text-white/70">illustrative ROI</Editable>
          </div>
        </div>

        <div>
          <Link
            href="/contact-us"
            onClick={(e) => cms?.editMode && e.preventDefault()}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-deep transition-transform hover:scale-[1.02]"
          >
            <Editable id="roi.cta">Get this measured for real</Editable>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Editable as="p" id="roi.disclaimer" className="mt-3 text-center text-[11px] text-white/50">
            Illustrative estimate based on 48 working weeks. Your tracked numbers
            may differ.
          </Editable>
        </div>
      </div>
    </div>
  );
}
