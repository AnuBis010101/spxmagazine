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

  /* The coin used to arrive at full size and then simply stop. Once it has
     settled it now runs a continuous idle: a slow rock on two axes, a conic
     specular travelling round the face, a counter-turning rim light and a
     breathing halo.

     Mounted only once settled, on the same principle as the glitch layers —
     nothing loops while the reader is still at the top of the page, and it
     unmounts again if they scroll back up. */
  const [settled, setSettled] = useState(false);
  useMotionValueEvent(grow, "change", (v) => {
    const on = v > 0.985;
    setSettled((prev) => (prev === on ? prev : on));
  });
  const idle = settled && !reduce;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative h-[110px] w-[110px] sm:h-[150px] sm:w-[150px] md:h-[180px] md:w-[180px]"
      >
        {/* Halo. A gradient rather than the old drop-shadow filter: a filter on
            the coin would re-rasterise it on every frame of the rock below. */}
        <span aria-hidden className={`coin-halo${idle ? " is-idle" : ""}`} />

        {/* The coin itself, on its own transform layer so the specular and rim
            can turn independently of it. */}
        <div className={`coin-stage${idle ? " is-idle" : ""}`}>
          <Image
            src="/spx6900-coin.png"
            alt=""
            fill
            priority
            sizes="360px"
            className="object-contain"
          />

          {idle && (
            <>
              {/* Light travelling round the struck face. Masked to the coin so
                  the highlight follows the minting rather than a square. */}
              <span aria-hidden className="coin-specular" />
              {/* A brighter, faster pass on the rim, turning the other way so
                  the two never beat in sync. */}
              <span aria-hidden className="coin-rim" />
            </>
          )}
        </div>

        {/* Glitch layers — chromatic RGB split + a datamosh slice.
            During the apparition these ride the scroll-driven `glitch` value.
            Once settled they stay mounted but switch to intermittent bursts:
            a coin that glitches continuously reads as broken rather than
            expensive, and the stepped keyframes mean each burst repaints only
            a handful of times. */}
        {glitchEnabled && (glitching || idle) && (
          <motion.div
            style={glitching ? { opacity: glitch } : undefined}
            className={`absolute inset-0${!glitching && idle ? " coin-glitch-burst" : ""}`}
          >
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
