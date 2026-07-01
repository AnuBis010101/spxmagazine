"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
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
 * prefers-reduced-motion → renders the final, static state (no transforms, no
 * blur). Touch → keeps the transform/opacity pull but drops the blur, which is
 * the one property prone to jank on mobile Safari (guardrail).
 */
export default function RackFocus({ children, className }: RackFocusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 when the block's top sits at the viewport bottom, 1 once it has risen
    // to ~35% from the top — the window over which focus resolves.
    offset: ["start end", "start 35%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.9], [0.25, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.85], [14, 0]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

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
        ...(isTouch ? {} : { filter }),
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
