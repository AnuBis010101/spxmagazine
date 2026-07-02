"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { frame, cancelFrame } from "framer-motion";

/**
 * Lenis smooth scroll, driven from Framer Motion's frame loop instead of a
 * standalone requestAnimationFrame. Sharing one loop means Lenis updates the
 * scroll position and Framer reads it (useScroll/useTransform/useVelocity) in
 * the same tick — no half-frame lag — so every scroll-linked effect on the
 * site (hero rack-focus, breathing orbit, parallax) stays frame-accurate.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // lerp (frame-rate-normalised interpolation) tracks the wheel continuously
    // for a natural, responsive glide — the fixed 1.2s duration mode felt floaty
    // and stuttered when scroll inputs stacked up. Touch stays native (Lenis's
    // default) so mobile keeps its own momentum.
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Framer drives the frame; keepAlive=true keeps it ticking every frame so
    // Lenis stays smooth even when no Framer animation is otherwise running.
    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
