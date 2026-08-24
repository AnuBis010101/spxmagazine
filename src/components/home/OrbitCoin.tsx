"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  useSpring,
  useVelocity,
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

  /* How far this page can actually scroll. The thresholds below were tuned for
     the homepage, whose fixed hero gives ~680px of runway before the coin
     should arrive. Now that the coin is on every route that assumption breaks:
     a short page like an empty reading list scrolls ~400px total, so the coin
     stalled at 40% scale and its idle never engaged.

     Measured through a ResizeObserver rather than an effect body, both because
     content height changes as images load and because writing state
     synchronously in an effect is a lint error in this codebase. */
  const [maxScroll, setMaxScroll] = useState(0);
  useEffect(() => {
    const measure = () => {
      const next = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      setMaxScroll((prev) => (Math.abs(prev - next) < 8 ? prev : next));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Keep the homepage's timing wherever there is room for it, and compress
     proportionally where there is not, so the coin always completes its
     arrival with scroll to spare. */
  const appearAt = maxScroll > 0 ? Math.min(200, maxScroll * 0.12) : 200;
  const visibleAt = maxScroll > 0 ? Math.min(560, maxScroll * 0.45) : 560;
  const fullAt = maxScroll > 0 ? Math.min(680, maxScroll * 0.6) : 680;

  const opacity = useTransform(scrollY, [appearAt, visibleAt], [0, 1]);
  const grow = useTransform(scrollY, [appearAt, fullAt], [0.4, 1]);
  const scale = reduce ? 1 : grow;
  // Glitch intensity peaks mid-apparition, then settles to a clean coin.
  const glitch = useTransform(
    scrollY,
    [appearAt * 1.1, (appearAt + fullAt) / 2, visibleAt],
    [0, 1, 0],
  );

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

  /* Once settled, the glitch answers the reader's hand rather than a timer:
     it destabilises while they scroll and resolves the moment they stop.

     Driven by scroll velocity through a spring, so it ramps in immediately
     but decays smoothly instead of snapping off at the end of a flick. The
     spring is also what stops a trackpad's jittery per-event velocity from
     making this strobe. */
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 260,
    damping: 34,
    mass: 0.35,
  });
  /* Divisor sets the dynamic range. At 1500 almost any real scroll saturated
     instantly, which threw away the part that makes this feel responsive; at
     2800 a slow drag breaks the coin up gently and only a hard flick tears it
     fully apart. */
  const scrollGlitch = useTransform(smoothVelocity, (v) =>
    Math.min(1, Math.abs(v) / 2800),
  );

  /* Pause the stepped keyframes underneath while the coin is at rest. They are
     cheap, but there is no reason to run them against an invisible layer. */
  const [moving, setMoving] = useState(false);
  useMotionValueEvent(scrollGlitch, "change", (v) => {
    const on = v > 0.04;
    setMoving((prev) => (prev === on ? prev : on));
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
            Once settled they answer scroll velocity instead: the coin breaks
            up under the reader's hand and resolves when they stop. */}
        {glitchEnabled && (glitching || idle) && (
          <motion.div
            style={{ opacity: glitching ? glitch : scrollGlitch }}
            className={`absolute inset-0${
              !glitching && idle && !moving ? " coin-glitch-still" : ""
            }`}
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
