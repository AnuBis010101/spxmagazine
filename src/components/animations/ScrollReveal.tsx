"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  /** Adds a subtle scale-up effect (e.g. 0.96 → 1) */
  scale?: boolean;
  /** Adds a blur-to-sharp entrance (e.g. 8px → 0) */
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

  const hidden = {
    opacity: 0,
    x: offset.x,
    y: offset.y,
    ...(scale && { scale: 0.96 }),
    ...(blur && { filter: "blur(8px)" }),
  };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(scale && { scale: 1 }),
    ...(blur && { filter: "blur(0px)" }),
  };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
