"use client";

import { useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { usePrice } from "@/hooks/usePrice";
import Image from "next/image";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { usePathname } from "next/navigation";
import { aeonOrbitSet, markSrc } from "@/lib/aeon";

/* Eight marks, every one a different Aeon — the pool holds exactly eight, so
   each appears once and none repeats around the field.

   Sizes come from the geometry rather than taste. With only two or three
   marks per ring the arc between neighbours on the SAME ring is enormous
   (212px of clearance at the tightest), so that never binds. What binds is
   the 125px radial gap between rings: marks on adjacent rings drift into
   radial alignment as the rings turn at different rates, and at that moment
   the pair must still clear each other. That caps any two adjacent sizes at
   ~105px combined.

   Inner marks are largest and outer smallest, so the field reads as depth.
   Measured clearances at these sizes: 83px between rings 1 and 2, 93px
   between rings 2 and 3 — the marks never come close to touching.

   Periods are not multiples of each other, so the rings never resynchronise
   into a pattern the eye can lock onto. */
/* One rotation period per MARK rather than per ring — sharing a period across
   a ring made the three marks on it turn in lockstep, which reads as a single
   rigid object. Primes, so no two ever come back into phase, and alternating
   direction so neighbours visibly disagree. */
const MARK_SPIN = [13, 19, 23, 29, 31, 37, 41, 43];
const markSpin = (i: number) => ({
  duration: MARK_SPIN[i % MARK_SPIN.length],
  reverse: i % 2 === 1,
});

const AEON_RINGS = [
  { radius: 150, duration: 46, size: 48, count: 3 },
  { radius: 275, duration: 71, size: 36, count: 3 },
  { radius: 400, duration: 97, size: 28, count: 2 },
] as const;

/* One orbiting medallion. The baked mark carries its own treatment, so there
   is no runtime filter here — just an image and a gold rim. */
/* A medallion turns about its own centre while it orbits, the way a moon
   turns as it goes round.

   Each ring rotates at its own period, and none is a factor of its own
   orbital period, so a mark never returns to the same attitude at the same
   point on its path. */
function AeonOrbiter({
  id,
  size,
  opacity,
  spin,
  reverse,
}: {
  id: number;
  size: number;
  opacity: number;
  spin: number;
  reverse: boolean;
}) {
  return (
    <span
      className="ob-aeon-axis"
      style={{
        width: size,
        height: size,
        animationDuration: `${spin}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      <span className="ob-aeon" style={{ width: size, height: size, opacity }}>
        <Image src={markSrc(id)} alt="" width={size * 2} height={size * 2} sizes={`${size}px`} />
      </span>
    </span>
  );
}

/* ── Orbiting glossary term — each term gets its own orbit ring ── */
function OrbitTerm({ term, radius, duration, startAngle, size, reverse, showRing }: {
  term: string; radius: number; duration: number; startAngle: number; size: number; reverse?: boolean; showRing?: boolean;
}) {
  const from = reverse ? startAngle + 360 : startAngle;
  const to = reverse ? startAngle : startAngle + 360;
  return (
    <>
      {showRing && (
        <motion.div
          className="absolute left-1/2 top-1/2 rounded-full border pointer-events-none"
          style={{
            width: radius * 2,
            height: radius * 2,
            marginLeft: -radius,
            marginTop: -radius,
            borderColor: "rgba(212,175,55,0.08)",
          }}
          animate={{ opacity: [0.06, 0.15, 0.06] }}
          transition={{ duration: duration * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{ width: 0, height: 0 }}
        animate={{ rotate: [from, to] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <motion.span
          className="absolute whitespace-nowrap font-display font-semibold"
          style={{ left: radius, top: -size / 2, fontSize: size }}
          animate={{
            rotate: [-from, -to],
            opacity: [0.12, 0.32, 0.12],
          }}
          transition={{
            rotate: { duration, repeat: Infinity, ease: "linear" },
            opacity: { duration: duration * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="bg-gradient-to-r from-gold-400/40 via-gold-300/60 to-gold-400/40 bg-clip-text text-transparent">
            {term}
          </span>
        </motion.span>
      </motion.div>
    </>
  );
}

/* ── Pulsing concentric rings ── */
function ConcentricRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[200, 320, 460, 600, 780].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border border-gold-400/[0.1]"
          style={{ width: size, height: size }}
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4 + i * 1.5,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* One dashed ring, not two. The second sat at r=260, inside the middle
          orbit's 257-293 band, so the 36px marks rode straight over it. This
          one clears the nearest mark edge by 16px. */}
      <motion.div
        className="absolute rounded-full border border-dashed border-gold-400/[0.12]"
        style={{ width: 380, height: 380 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

    </div>
  );
}

/**
 * Fixed orbit background — always visible behind all page content.
 * Renders the orbit system, concentric rings, and radial glow.
 */
export default function OrbitBackground({ glossaryTerms, showTerms = true }: { glossaryTerms: string[]; showTerms?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cap the number of orbiting terms so the animation cost doesn't grow with the
  // glossary size (each term spawns several always-on Framer loops).
  // Fewer terms now that the medallions carry the orbit; these are texture.
  const MAX_TERMS = 8;
  const terms = (glossaryTerms.length > 0
    ? glossaryTerms
    : [
        "Cognisphere", "SPX6900", "Flippening", "Murad", "Polymetric",
        "S&P 500", "Diamond Hands", "WAGMI", "Community", "Onchain",
        "Decentralized", "Movement", "Believe", "Revolution", "Cathedral",
        "Aeon", "DCA", "The Ticker", "6900", "Euphoria",
      ]
  ).slice(0, MAX_TERMS);

  const orbitConfigs = useMemo(() => {
    if (!mounted) return [];
    const count = terms.length;
    // Pushed outside the medallion orbits so the two layers never collide.
    const minRadius = 470;
    const maxRadius = 700;
    return terms.map((term, i) => {
      const t = count > 1 ? i / (count - 1) : 0;
      const radius = minRadius + t * (maxRadius - minRadius);
      const duration = 18 + t * 40;
      const startAngle = (360 / count) * i + (i % 3) * 30;
      const reverse = i % 2 === 1;
      const size = 11 - t * 3;
      const showRing = i % 2 === 0;
      return { term, radius, duration, startAngle, reverse, size: Math.max(size, 8), showRing };
    });
  }, [mounted, terms]);

  // ── Momentum-reactive "breathing" ──────────────────────────────────────────
  // The orbit gently inhales with scroll velocity (the reader) and warms/cools
  // its central glow with the 24h price move (the market) — the background
  // "responds to the reader and to the live market". Cheap: two compositor-only
  // transforms driven by one shared spring, plus a data-driven gradient string.
  /* Each route draws its own cast of eight from the wider pool, so moving
     between pages changes which Aeons are overhead. Keyed off the path and
     deterministic, so a given page keeps the same eight across renders — they
     must not reshuffle under a reader who scrolls back up. */
  const pathname = usePathname();
  const aeonRings = useMemo(() => {
    const total = AEON_RINGS.reduce((n, r) => n + r.count, 0);
    const cast = aeonOrbitSet(pathname || "/", total);
    let cursor = 0;
    return AEON_RINGS.map((ring) => {
      const ids = cast.slice(cursor, cursor + ring.count);
      cursor += ring.count;
      return { ...ring, ids };
    });
  }, [pathname]);

  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVel = useSpring(scrollVelocity, { stiffness: 55, damping: 22, mass: 0.6 });
  // Symmetric v-shape: fast scroll in either direction adds energy (Framer clamps).
  const breathScale = useTransform(smoothVel, [-3500, 0, 3500], [1.045, 1, 1.045]);
  const glowScale = useTransform(smoothVel, [-3500, 0, 3500], [1.1, 1, 1.1]);

  const { change24h, loading: priceLoading } = usePrice();
  const glowGradient = useMemo(() => {
    if (priceLoading || !Number.isFinite(change24h)) {
      return "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)";
    }
    const mag = Math.min(1, Math.abs(change24h) / 15); // ±15% ≈ full swing
    const alpha = change24h >= 0 ? 0.1 + mag * 0.11 : 0.08 + mag * 0.04;
    const rgb = change24h >= 0 ? "212,175,55" : "150,124,60"; // warm gold up / muted down
    return `radial-gradient(circle, rgba(${rgb},${alpha.toFixed(3)}) 0%, transparent 60%)`;
  }, [change24h, priceLoading]);

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, ...(reduce ? {} : { scale: breathScale }) }}
    >
      {/* Radial glow — warms/cools with the market, scales with scroll energy */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-[900px] h-[900px] sm:w-[1200px] sm:h-[1200px] rounded-full"
          style={{ background: glowGradient, ...(reduce ? {} : { scale: glowScale }) }}
        />
      </div>

      {/* Concentric pulsing rings */}
      <ConcentricRings />

      {/* Aeon medallions on three counter-turning orbits. Each rides a single
          CSS keyframe animating transform, so a dozen of them cost far less
          than the JS-driven term orbit they replace — which matters now this
          background is on every route.

          Larger and nearer the centre, smaller and fainter further out, so the
          orbit reads as depth rather than as a flat ring of stickers. */}
      <div className="absolute inset-0">
        {aeonRings.map((orbit, ring) => (
          <OrbitingCircles
            key={orbit.radius}
            radius={orbit.radius}
            duration={orbit.duration}
            iconSize={orbit.size}
            reverse={ring === 1}
            pathOpacity={[0.16, 0.12, 0.09][ring]}
          >
            {orbit.ids.map((id, i) => {
              // continuous index across all rings, so every mark differs
              const flat = aeonRings.slice(0, ring).reduce((n, o) => n + o.ids.length, 0) + i;
              const spin = markSpin(flat);
              return (
                <AeonOrbiter
                  key={id}
                  id={id}
                  size={orbit.size}
                  spin={spin.duration}
                  reverse={spin.reverse}
                  opacity={[0.72, 0.58, 0.46][ring]}
                />
              );
            })}
          </OrbitingCircles>
        ))}
      </div>

      {/* Glossary terms kept as the faintest layer, out beyond the medallions,
          so the words remain part of the background without competing. */}
      {showTerms && (
        <div className="absolute inset-0 flex items-center justify-center">
          {orbitConfigs.map((cfg, i) => (
            <OrbitTerm
              key={`orbit-${i}`}
              term={cfg.term}
              radius={cfg.radius}
              duration={cfg.duration}
              startAngle={cfg.startAngle}
              size={cfg.size}
              reverse={cfg.reverse}
              showRing={cfg.showRing}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
