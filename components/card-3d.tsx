"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";

/* 21st.dev / Aceternity-style "3D Card Effect":
   the card tilts toward the cursor and its child <Card3DItem>s float to
   different translateZ depths on hover — real layered 3D. */

const HoverCtx = createContext(false);

export function Card3D({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 22;
    const y = (e.clientY - top - height / 2) / 22;
    el.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  }
  function onLeave() {
    setHovered(false);
    if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  return (
    <HoverCtx.Provider value={hovered}>
      <div className={`[perspective:1200px] ${className}`}>
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative h-full transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        >
          {children}
        </div>
      </div>
    </HoverCtx.Provider>
  );
}

export function Card3DItem({
  children,
  z = 0,
  className = "",
}: {
  children: ReactNode;
  z?: number;
  className?: string;
}) {
  const hovered = useContext(HoverCtx);
  return (
    <div
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform: hovered ? `translateZ(${z}px)` : "translateZ(0px)" }}
    >
      {children}
    </div>
  );
}
