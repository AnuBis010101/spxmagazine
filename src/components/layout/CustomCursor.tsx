"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A gold halo ring that trails the pointer with a springy lag — a premium touch
 * that AUGMENTS (never replaces) the native cursor, so keyboard/AT users are
 * unaffected. Only active on fine pointers with motion allowed; on touch or
 * reduced-motion the ring simply never receives a position and stays off-screen.
 */
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <div
        className="-ml-4 -mt-4 h-8 w-8 rounded-full border border-gold-400/50"
        style={{ boxShadow: "0 0 14px rgba(212,175,55,0.3)" }}
      />
    </motion.div>
  );
}
