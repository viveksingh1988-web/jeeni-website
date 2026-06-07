import Link from "next/link";
import type { ReactNode } from "react";

export function BentoGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  description,
  icon: Icon,
  href,
  cta,
  span = "",
  featured = false,
  visual,
  stat,
}: {
  title: ReactNode;
  description: ReactNode;
  icon?: () => ReactNode;
  href?: string;
  cta?: ReactNode;
  span?: string;
  featured?: boolean;
  visual?: ReactNode;
  stat?: ReactNode;
}) {
  const className = `group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-transform duration-300 hover:-translate-y-1 ${
    featured ? "border-beam glow-ring" : "glow-ring"
  } ${span}`;

  const inner = (
    <>
      {visual && (
        <div className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
          {visual}
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col">
        {Icon && (
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white">
            <Icon />
          </div>
        )}
        {stat && (
          <div className="mb-2 font-display text-4xl font-extrabold text-gradient sm:text-5xl">
            {stat}
          </div>
        )}
        <h3 className="font-display text-xl font-semibold leading-snug">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
        {href && cta && (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-blue">
            {cta}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

/* ---- decorative SVG backgrounds ---- */
export function GridGlow() {
  return (
    <div className="absolute inset-0">
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue/20 blur-3xl" />
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
        <defs>
          <pattern id="b-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#0f172a" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#b-grid)" />
      </svg>
    </div>
  );
}

export function BarsGlow() {
  return (
    <div className="absolute bottom-0 right-0 flex items-end gap-1.5 p-6 opacity-70">
      {[40, 64, 52, 84, 72, 100].map((h, i) => (
        <span
          key={i}
          style={{ height: h }}
          className="w-3 rounded-t bg-gradient-to-t from-blue/30 to-blue-bright/70"
        />
      ))}
    </div>
  );
}
