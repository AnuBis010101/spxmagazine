"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  /** Adds a subtle scale-up effect (e.g. 0.96 → 1) */
  scale?: boolean;
  /**
   * Softer entrance. Retained for the ~46 call sites that pass it, but it no
   * longer animates `filter: blur()`.
   *
   * A blur is not a compositor property: animating it re-rasterises the
   * element's whole subtree every frame, and with this many reveals firing as
   * the reader scrolls, the page visibly flashes. The same defect was already
   * found and removed from the hero and the header — this was the last place
   * it survived.
   *
   * The soft read is kept with a slightly deeper, slower opacity ramp and a
   * touch more travel, both of which the compositor handles for free.
   */
  blur?: boolean;
}

const directionOffsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  className,
  scale = false,
  blur = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  const offset = directionOffsets[direction];

  // `blur` deepens the entrance instead of filtering it: a little extra travel
  // and a slightly smaller start read as soft focus, using only transform and
  // opacity.
  const soften = blur ? 1.35 : 1;

  const hidden = {
    opacity: 0,
    x: offset.x * soften,
    y: offset.y * soften,
    ...((scale || blur) && { scale: blur && !scale ? 0.985 : 0.96 }),
  };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    ...((scale || blur) && { scale: 1 }),
  };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{ duration, delay, ease: EASE.out }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
