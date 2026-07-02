"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface RackFocusProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Scroll-linked "rack focus" — as the element rises into view it pulls from
 * blurred / pushed-back / dim to sharp / settled / opaque, continuously tied to
 * scroll position (not a one-shot reveal). Paired with the hero's rack-focus
 * *out*, it reads as a cinematic focus pull handing the frame from the hero to
 * the first content block. Frame-accurate because Lenis shares Framer's loop.
 *
 * The pull is expressed with opacity + scale + y only — all compositor-cheap.
 * A scroll-linked filter:blur() used to ride along, but animating a blur radius
 * per frame forces a full re-rasterisation and was a real scroll-smoothness cost;
 * scale + fade still read as a focus pull without it.
 *
 * prefers-reduced-motion → renders the final, static state (no transforms).
 */
export default function RackFocus({ children, className }: RackFocusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 when the block's top sits at the viewport bottom, 1 once it has risen
    // to ~35% from the top — the window over which focus resolves.
    offset: ["start end", "start 35%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.9], [0.25, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [64, 0]);

  // Static final state for reduced-motion users.
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        scale,
        y,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
