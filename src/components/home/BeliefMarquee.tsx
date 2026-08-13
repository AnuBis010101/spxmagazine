"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/animations/ScrollVelocity";

/* ─────────────────────────────────────────────────────────────────────────
   The movement's line, running as a scroll-reactive band between the
   Departments grid and Trending.

   Two rows travelling opposite ways: the top one carries the gold, the
   lower one sits back as a muted echo so the band reads as depth rather
   than as two competing tickers. Both speed up with scroll velocity and
   reverse when the reader scrolls back up.
   ──────────────────────────────────────────────────────────────────────── */

const LINE = "Stop Trading & Believe in something";

/**
 * One repetition. The trailing padding matches the inner gap exactly, so the
 * space after the emojis reads the same as the space before them and the loop
 * has one uniform rhythm rather than a wide seam at each join.
 */
function Phrase({ muted = false }: { muted?: boolean }) {
  return (
    <span className="flex items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
      <span className={muted ? "bm-line bm-line--muted" : "bm-line"}>{LINE}</span>
      <span className="bm-emoji" aria-hidden>
        💹 🧲
      </span>
    </span>
  );
}

export default function BeliefMarquee() {
  return (
    /* Padding is deliberately tiny: the rules sit close in against the text. */
    <section
      aria-label={LINE}
      className="bm-band relative isolate overflow-hidden py-[0.25rem] sm:py-[0.35rem]"
    >
      <ScrollVelocityContainer className="bm-mask font-display font-bold tracking-tight">
        <ScrollVelocityRow baseVelocity={6} direction={1}>
          <Phrase />
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} className="mt-2 sm:mt-3">
          <Phrase muted />
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      <style>{`
        /* Hairline rules + a faint gold wash tie the band to the sections
           either side without boxing it in. */
        .bm-band {
          border-top: 1px solid color-mix(in oklab, var(--color-gold-400) 16%, transparent);
          border-bottom: 1px solid color-mix(in oklab, var(--color-gold-400) 16%, transparent);
          background:
            radial-gradient(120% 100% at 50% 50%,
              color-mix(in oklab, var(--color-gold-400) 7%, transparent),
              transparent 70%),
            var(--color-mag-black);
        }
        /* Fade both ends so the loop never shows a hard seam at the edge. */
        .bm-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .bm-line {
          font-size: clamp(1.75rem, 6vw, 4.25rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
          background: linear-gradient(
            110deg,
            var(--color-gold-500) 0%,
            var(--color-gold-300) 28%,
            #fff6d8 50%,
            var(--color-gold-300) 72%,
            var(--color-gold-500) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        /* The echo: outlined rather than filled, so it recedes. */
        .bm-line--muted {
          background: none;
          -webkit-text-fill-color: transparent;
          color: transparent;
          -webkit-text-stroke: 1px color-mix(in oklab, var(--color-gold-400) 34%, transparent);
        }
        .bm-emoji {
          font-size: clamp(1.25rem, 4vw, 2.75rem);
          line-height: 1;
        }
      `}</style>
    </section>
  );
}
