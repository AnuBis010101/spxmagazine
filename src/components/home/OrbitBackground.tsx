"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

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
            opacity: [0.25, 0.6, 0.25],
          }}
          transition={{
            rotate: { duration, repeat: Infinity, ease: "linear" },
            opacity: { duration: duration * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="bg-gradient-to-r from-gold-400/60 via-gold-300/90 to-gold-400/60 bg-clip-text text-transparent">
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
      <motion.div
        className="absolute rounded-full border border-dashed border-gold-400/[0.12]"
        style={{ width: 380, height: 380 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full border border-dashed border-gold-400/[0.09]"
        style={{ width: 520, height: 520 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
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
  const MAX_TERMS = 14;
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
    const minRadius = 120;
    const maxRadius = 480;
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

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] sm:w-[1200px] sm:h-[1200px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)" }}
      />

      {/* Concentric pulsing rings */}
      <ConcentricRings />

      {/* Orbiting terms */}
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
    </div>
  );
}
