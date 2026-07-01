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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
