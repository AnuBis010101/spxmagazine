"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────
   Filament divider — the seam between Trending and the market-cap gauge.

   A hairline draws itself outward from the centre as the divider crosses the
   viewport, a faceted ornament turns with it, and two sparks run out along
   the rule to the edges. Everything is driven by one scroll spring, so the
   whole thing eases as a single object rather than four separate tweens.

   Deliberately transform/opacity only. No scroll-linked filters and no
   backdrop-blur: softness comes from gradients, which cost nothing per frame,
   and the one glint is a CSS keyframe rather than a scroll subscription.
   Under prefers-reduced-motion it renders in its finished state, drawn.
   ──────────────────────────────────────────────────────────────────────── */

export default function FilamentDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Progress across the divider's own approach to centre screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "center 62%"],
  });
  // One spring feeds every derived value, so they move as a single gesture.
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 });

  const ruleScale = useTransform(p, [0, 1], [0, 1]);
  const ruleFade = useTransform(p, [0, 0.25, 1], [0, 0.7, 1]);
  const coreScale = useTransform(p, [0, 0.65, 1], [0, 0.35, 1]);
  const gemRotate = useTransform(p, [0, 1], [0, 135]);
  const gemScale = useTransform(p, [0, 0.5, 1], [0.35, 1.06, 1]);
  const gemFade = useTransform(p, [0, 0.3, 1], [0, 1, 1]);
  const haloScale = useTransform(p, [0, 1], [0.4, 1]);
  const haloFade = useTransform(p, [0, 0.6, 1], [0, 0.9, 0.55]);
  const sparkOut = useTransform(p, [0, 1], ["0%", "2600%"]);
  // Hoisted rather than derived inline in JSX — hooks must not be called there.
  const sparkOutLeft = useTransform(p, [0, 1], ["0%", "-2600%"]);
  const sparkFade = useTransform(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  /* Reduced motion gets the finished state: rule drawn, ornament settled,
     sparks already gone. Same markup, nothing subscribed to scroll. */
  const anim = {
    ruleScale: reduce ? 1 : ruleScale,
    ruleFade: reduce ? 1 : ruleFade,
    coreScale: reduce ? 1 : coreScale,
    gemRotate: reduce ? 135 : gemRotate,
    gemScale: reduce ? 1 : gemScale,
    gemFade: reduce ? 1 : gemFade,
    haloScale: reduce ? 1 : haloScale,
    haloFade: reduce ? 0.55 : haloFade,
    sparkOut: reduce ? "2600%" : sparkOut,
    sparkOutLeft: reduce ? "-2600%" : sparkOutLeft,
    sparkFade: reduce ? 0 : sparkFade,
  };

  return (
    <div
      ref={ref}
      aria-hidden
      className="fd-wrap relative mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      {/* soft ground — a gradient, never a filter */}
      <motion.span
        className="fd-halo"
        style={{ scaleX: anim.haloScale, opacity: anim.haloFade }}
      />

      {/* the rule */}
      <motion.span
        className="fd-rule"
        style={{ scaleX: anim.ruleScale, opacity: anim.ruleFade }}
      >
        <span className="fd-glint" />
      </motion.span>

      {/* brighter core that resolves last */}
      <motion.span className="fd-core" style={{ scaleX: anim.coreScale }} />

      {/* sparks running out to both edges */}
      <motion.span className="fd-spark" style={{ x: anim.sparkOut, opacity: anim.sparkFade }} />
      <motion.span className="fd-spark" style={{ x: anim.sparkOutLeft, opacity: anim.sparkFade }} />

      {/* centre ornament */}
      <motion.span
        className="fd-gem"
        style={{ rotate: anim.gemRotate, scale: anim.gemScale, opacity: anim.gemFade }}
      >
        <span className="fd-gem-core" />
      </motion.span>

      <style>{`
        .fd-wrap { isolation: isolate; }

        /* Wide, faint pool of gold behind the rule. Pure gradient — no blur. */
        .fd-halo {
          position: absolute;
          left: 50%; top: 50%;
          width: min(760px, 72%); height: 150px;
          transform-origin: center;
          translate: -50% -50%;
          background: radial-gradient(
            50% 50% at 50% 50%,
            color-mix(in oklab, var(--color-gold-400) 17%, transparent) 0%,
            transparent 72%
          );
          pointer-events: none;
        }

        .fd-rule {
          position: relative;
          display: block;
          width: min(880px, 82%);
          height: 1px;
          transform-origin: center;
          overflow: hidden;
          background: linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in oklab, var(--color-gold-400) 34%, transparent) 22%,
            color-mix(in oklab, var(--color-gold-300) 78%, transparent) 50%,
            color-mix(in oklab, var(--color-gold-400) 34%, transparent) 78%,
            transparent 100%
          );
        }

        /* Specular sweep. Runs on its own clock so the seam is never inert. */
        .fd-glint {
          position: absolute; inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 246, 216, 0.95) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          width: 34%;
          animation: fdGlint 4.8s cubic-bezier(0.6, 0, 0.2, 1) infinite;
        }

        /* Short, brighter filament sitting on top of the rule. */
        .fd-core {
          position: absolute;
          left: 50%; top: 50%;
          width: min(190px, 26%); height: 1px;
          translate: -50% -50%;
          transform-origin: center;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in oklab, #fff6d8 88%, transparent),
            transparent
          );
        }

        .fd-spark {
          position: absolute;
          left: 50%; top: 50%;
          width: 3px; height: 3px;
          margin-left: -1.5px; margin-top: -1.5px;
          border-radius: 9999px;
          background: #fff6d8;
          box-shadow: 0 0 10px 1px color-mix(in oklab, var(--color-gold-300) 85%, transparent);
          pointer-events: none;
        }

        /* Faceted ornament: a square stood on its corner by the scroll spring. */
        .fd-gem {
          position: absolute;
          left: 50%; top: 50%;
          width: 13px; height: 13px;
          margin-left: -6.5px; margin-top: -6.5px;
          display: grid; place-items: center;
          border: 1px solid color-mix(in oklab, var(--color-gold-300) 82%, transparent);
          background: linear-gradient(
            135deg,
            color-mix(in oklab, var(--color-gold-500) 55%, transparent),
            color-mix(in oklab, var(--color-gold-200) 70%, transparent)
          );
          box-shadow:
            0 0 14px -2px color-mix(in oklab, var(--color-gold-400) 75%, transparent),
            inset 0 0 6px -2px #fff6d8;
        }
        .fd-gem-core {
          width: 3px; height: 3px;
          background: #fff6d8;
          box-shadow: 0 0 6px 1px color-mix(in oklab, #fff6d8 70%, transparent);
        }

        @keyframes fdGlint {
          0%   { transform: translateX(-140%); }
          55%  { transform: translateX(420%); }
          100% { transform: translateX(420%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .fd-glint { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
