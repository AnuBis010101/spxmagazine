"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";

/**
 * The SPX6900 coin, revealed in the centre of the orbit as the reader scrolls
 * off the homepage hero — it slowly grows and glitches into focus, then recedes
 * back to nothing when they return to the top so the hero writings stay clear.
 *
 * Fixed and viewport-centred (aligned with the orbit's centre), sitting above
 * the orbit rings but behind all content. Scroll-linked, so scrolling up
 * reverses it exactly. prefers-reduced-motion → a plain scroll-tied fade at full
 * scale, no glitch, no grow. Touch → keeps the grow but drops the glitch layers
 * (blend/filter/clip stacking is the expensive part).
 */
export default function OrbitCoin() {
  const reduce = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const { scrollY } = useScroll();
  // Hold off until the hero writings have started to leave, so the coin never
  // competes with them near the top — then it fades/grows in.
  const opacity = useTransform(scrollY, [200, 560], [0, 1]);
  const grow = useTransform(scrollY, [200, 680], [0.4, 1]);
  const scale = reduce ? 1 : grow;
  // Glitch intensity peaks mid-apparition, then settles to a clean coin.
  const glitch = useTransform(scrollY, [220, 400, 560], [0, 1, 0]);

  const glitchEnabled = !reduce && !isTouch;

  // Only mount (and thus run) the glitch layers while actually appearing, so no
  // animation loops idle behind the scenes the rest of the time.
  const [glitching, setGlitching] = useState(false);
  useMotionValueEvent(glitch, "change", (v) => {
    const on = v > 0.02;
    setGlitching((prev) => (prev === on ? prev : on));
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative h-[110px] w-[110px] sm:h-[150px] sm:w-[150px] md:h-[180px] md:w-[180px]"
      >
        {/* Base coin with a soft gold aura */}
        <Image
          src="/spx6900-coin.png"
          alt=""
          fill
          priority
          sizes="360px"
          className="object-contain drop-shadow-[0_0_45px_rgba(212,175,55,0.4)]"
        />

        {/* Glitch layers — chromatic RGB split + a datamosh slice, only while appearing */}
        {glitchEnabled && glitching && (
          <motion.div style={{ opacity: glitch }} className="absolute inset-0">
            <Image
              src="/spx6900-coin.png"
              alt=""
              fill
              sizes="360px"
              className="coin-glitch-red object-contain"
            />
            <Image
              src="/spx6900-coin.png"
              alt=""
              fill
              sizes="360px"
              className="coin-glitch-cyan object-contain"
            />
            <Image
              src="/spx6900-coin.png"
              alt=""
              fill
              sizes="360px"
              className="coin-glitch-slice object-contain"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
