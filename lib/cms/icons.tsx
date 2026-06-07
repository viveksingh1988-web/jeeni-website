import type { SVGProps } from "react";

/* A built-in icon set for the CMS icon picker. All icons share the same
   stroke style so they look consistent anywhere on the site. */

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

type P = { className?: string };
const S = (children: React.ReactNode) =>
  function Icon({ className }: P) {
    return (
      <svg {...base} className={className ?? "h-6 w-6"}>
        {children}
      </svg>
    );
  };

export const ICONS: Record<string, (p: P) => React.ReactNode> = {
  trend: S(<path d="M3 17l6-6 4 4 8-8M21 7v5M21 7h-5" />),
  clock: S(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  coin: S(<><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>),
  target: S(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>),
  rocket: S(<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 11a8 8 0 0 1 8-8c2 0 3 1 3 3a8 8 0 0 1-8 8M9 11l4 4M9 11l-3 .5M13 15l-.5 3" />),
  spark: S(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />),
  map: S(<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />),
  build: S(<path d="m8 9-5 3 5 3M16 9l5 3-5 3M14 5l-4 14" />),
  flow: S(<><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a3 3 0 0 1 3 3v6" /></>),
  chart: S(<path d="M3 3v18h18M7 14l3-4 3 3 4-6" />),
  shield: S(<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />),
  bolt: S(<path d="M13 2 4 14h7l-1 8 9-12h-7z" />),
  gear: S(<><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.5-2-1.5c.1-.3.1-.7.1-1z" /></>),
  globe: S(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z" /></>),
  users: S(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" /></>),
  brain: S(<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 4 3 3 0 0 0 5 1V4a3 3 0 0 0-0 0zM12 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-2 4 3 3 0 0 1-5 1" />),
  check: S(<path d="M20 6 9 17l-5-5" />),
  star: S(<path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9z" />),
  bulb: S(<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />),
  lock: S(<><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  chat: S(<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z" />),
  doc: S(<><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v4h4M9 13h6M9 17h6" /></>),
  search: S(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  layers: S(<path d="M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 18l10 5 10-5" />),
  heart: S(<path d="M12 21C5 16 3 12 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 12 19 16 12 21z" />),
  award: S(<><circle cx="12" cy="9" r="6" /><path d="m9 14-1 8 4-2 4 2-1-8" /></>),
  eye: S(<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>),
  pulse: S(<path d="M3 12h4l2-6 4 12 2-6h6" />),
  database: S(<><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>),
  cloud: S(<path d="M7 18a5 5 0 0 1-.5-10A7 7 0 0 1 20 9a4 4 0 0 1-1 9z" />),
};

export const ICON_NAMES = Object.keys(ICONS);

/** Render an icon by name (falls back to a spark if unknown). */
export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? ICONS.spark;
  return <>{C({ className })}</>;
}
