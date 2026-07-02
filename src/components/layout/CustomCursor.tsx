"use client";

import { useEffect, useRef } from "react";

/**
 * A gold halo ring that hugs the pointer — a premium accent that AUGMENTS
 * (never replaces) the native cursor, so keyboard/AT users are unaffected.
 *
 * The position is written straight to the element's transform inside the
 * mousemove handler — no spring, no React re-render — so it tracks the pointer
 * as tightly as a JS overlay can (a springy lag felt sluggish). Only active on
 * fine pointers with motion allowed; on touch or reduced-motion it never
 * receives a position and stays off-screen.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <div
        className="-ml-4 -mt-4 h-8 w-8 rounded-full border border-gold-400/50"
        style={{ boxShadow: "0 0 14px rgba(212,175,55,0.3)" }}
      />
    </div>
  );
}
