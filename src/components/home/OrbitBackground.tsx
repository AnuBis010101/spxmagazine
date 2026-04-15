"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 1 — Orbiting glossary terms (existing)
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 2 — Concentric pulsing rings (existing, enhanced)
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 3 — Floating particle field (stardust)
   ═══════════════════════════════════════════════════════════════════════════ */

interface Particle {
  x: number; y: number; size: number;
  driftX: number; driftY: number;
  duration: number; delay: number; opacity: number;
}

function ParticleField() {
  const particles = useMemo<Particle[]>(() => {
    const count = 45;
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 30,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
            boxShadow: p.size > 2
              ? `0 0 ${p.size * 3}px rgba(212,175,55,${p.opacity * 0.5})`
              : "none",
          }}
          animate={{
            x: [0, p.driftX, -p.driftX * 0.5, 0],
            y: [0, p.driftY, -p.driftY * 0.3, 0],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 4 — Aurora light bands
   ═══════════════════════════════════════════════════════════════════════════ */

function AuroraBands() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary gold aurora */}
      <motion.div
        className="absolute w-[150%] h-[300px]"
        style={{
          top: "20%",
          left: "-25%",
          background: "linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.03) 30%, rgba(212,175,55,0.06) 50%, rgba(212,175,55,0.03) 70%, transparent 100%)",
          filter: "blur(60px)",
          transformOrigin: "center center",
        }}
        animate={{
          rotate: [0, 3, -2, 1, 0],
          scaleY: [1, 1.3, 0.8, 1.1, 1],
          y: [0, -20, 10, -5, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary warm aurora */}
      <motion.div
        className="absolute w-[130%] h-[200px]"
        style={{
          top: "55%",
          left: "-15%",
          background: "linear-gradient(180deg, transparent 0%, rgba(191,155,48,0.025) 30%, rgba(191,155,48,0.05) 50%, rgba(191,155,48,0.025) 70%, transparent 100%)",
          filter: "blur(80px)",
          transformOrigin: "center center",
        }}
        animate={{
          rotate: [0, -2, 3, -1, 0],
          scaleY: [1, 0.9, 1.2, 0.95, 1],
          y: [0, 15, -10, 5, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Subtle amber accent */}
      <motion.div
        className="absolute w-[80%] h-[150px]"
        style={{
          top: "35%",
          left: "10%",
          background: "linear-gradient(180deg, transparent 0%, rgba(225,200,114,0.02) 40%, rgba(225,200,114,0.04) 50%, rgba(225,200,114,0.02) 60%, transparent 100%)",
          filter: "blur(50px)",
          transformOrigin: "center center",
        }}
        animate={{
          rotate: [0, 1.5, -2.5, 0.5, 0],
          scaleX: [1, 1.1, 0.95, 1.05, 1],
          opacity: [0.6, 1, 0.7, 0.9, 0.6],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 5 — Sacred geometry (hexagonal + Flower of Life)
   ═══════════════════════════════════════════════════════════════════════════ */

function SacredGeometry() {
  // Flower-of-life petal positions around center
  const petalOffsets = useMemo(() => {
    const r = 60;
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (i * 60 * Math.PI) / 180;
      return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer rotating hexagon */}
      <motion.svg
        width="260"
        height="260"
        viewBox="-130 -130 260 260"
        className="absolute"
        style={{ opacity: 0.06 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60"
          fill="none"
          stroke="rgba(212,175,55,1)"
          strokeWidth="0.5"
        />
      </motion.svg>

      {/* Inner counter-rotating hexagon */}
      <motion.svg
        width="180"
        height="180"
        viewBox="-90 -90 180 180"
        className="absolute"
        style={{ opacity: 0.05 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40"
          fill="none"
          stroke="rgba(212,175,55,1)"
          strokeWidth="0.5"
        />
      </motion.svg>

      {/* Flower of Life — 6 petals (circles around center) */}
      <motion.svg
        width="200"
        height="200"
        viewBox="-100 -100 200 200"
        className="absolute"
        animate={{ opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Center circle */}
        <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(212,175,55,0.8)" strokeWidth="0.4" />
        {/* Petals */}
        {petalOffsets.map((p, i) => (
          <circle
            key={`petal-${i}`}
            cx={p.x} cy={p.y} r="60"
            fill="none"
            stroke="rgba(212,175,55,0.8)"
            strokeWidth="0.4"
          />
        ))}
      </motion.svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 6 — Shooting stars (occasional streaks of light)
   ═══════════════════════════════════════════════════════════════════════════ */

function ShootingStars() {
  const stars = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      startX: 10 + Math.random() * 40,
      startY: 5 + Math.random() * 30,
      angle: 25 + Math.random() * 20,
      length: 80 + Math.random() * 120,
      duration: 1 + Math.random() * 0.6,
      delay: 4 + i * 7 + Math.random() * 5,
      total: 12 + i * 7 + Math.random() * 5,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute"
          style={{
            left: `${s.startX}%`,
            top: `${s.startY}%`,
            width: s.length,
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 40%, rgba(255,255,255,0.9) 100%)`,
            borderRadius: 1,
            transformOrigin: "left center",
            transform: `rotate(${s.angle}deg)`,
            filter: "blur(0.3px)",
          }}
          animate={{
            opacity: [0, 0, 1, 1, 0, 0],
            scaleX: [0, 0, 0.3, 1, 1, 0],
            x: [0, 0, 0, s.length * 0.5, s.length, s.length],
          }}
          transition={{
            duration: s.total,
            times: [0, s.delay / s.total, (s.delay + 0.1) / s.total, (s.delay + s.duration * 0.4) / s.total, (s.delay + s.duration) / s.total, 1],
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 7 — Nebula clouds (soft volumetric fog)
   ═══════════════════════════════════════════════════════════════════════════ */

function NebulaClouds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep nebula — upper left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: "-10%",
          left: "-10%",
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.025) 0%, rgba(140,111,34,0.01) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.15, 1.05, 1.2, 1],
          x: [0, 30, -10, 20, 0],
          y: [0, 15, -20, 5, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Warm nebula — lower right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: "-5%",
          right: "-5%",
          background: "radial-gradient(ellipse at center, rgba(191,155,48,0.02) 0%, rgba(166,133,41,0.008) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          scale: [1, 1.1, 0.95, 1.15, 1],
          x: [0, -20, 15, -10, 0],
          y: [0, -15, 10, -5, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Centre haze — breathes with the rings */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%)",
          filter: "blur(30px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 8 — Light rays emanating from center
   ═══════════════════════════════════════════════════════════════════════════ */

function LightRays() {
  const rays = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: i * 45,
        length: 350 + (i % 3) * 100,
        width: 1 + (i % 2),
        opacity: 0.03 + (i % 3) * 0.01,
        delay: i * 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {rays.map((r, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute"
          style={{
            width: r.length,
            height: r.width,
            background: `linear-gradient(90deg, rgba(212,175,55,${r.opacity * 3}) 0%, rgba(212,175,55,${r.opacity}) 40%, transparent 100%)`,
            transformOrigin: "left center",
            transform: `rotate(${r.angle}deg)`,
            filter: "blur(1px)",
          }}
          animate={{
            opacity: [r.opacity, r.opacity * 2.5, r.opacity],
            scaleX: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 5 + i * 0.7,
            delay: r.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 9 — Parallax mouse-tracking glow
   ═══════════════════════════════════════════════════════════════════════════ */

function MouseGlow() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 30, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const glowX = useTransform(smoothX, [0, 1], ["-10%", "110%"]);
  const glowY = useTransform(smoothY, [0, 1], ["-10%", "110%"]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 500,
        height: 500,
        left: glowX,
        top: glowY,
        x: "-50%",
        y: "-50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 30%, transparent 60%)",
        filter: "blur(40px)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 10 — Micro grid (subtle dot matrix)
   ═══════════════════════════════════════════════════════════════════════════ */

function MicroGrid() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(212,175,55,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — Composite of all layers
   ═══════════════════════════════════════════════════════════════════════════ */

export default function OrbitBackground({
  glossaryTerms,
  showTerms = true,
}: {
  glossaryTerms: string[];
  showTerms?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const terms =
    glossaryTerms.length > 0
      ? glossaryTerms
      : [
          "Cognisphere", "SPX6900", "Flippening", "Murad", "Polymetric",
          "S&P 500", "Diamond Hands", "WAGMI", "Community", "Onchain",
          "Decentralized", "Movement", "Believe", "Revolution", "Cathedral",
          "Aeon", "DCA", "The Ticker", "6900", "Euphoria",
        ];

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
      {/* L10 — Subtle dot grid */}
      <MicroGrid />

      {/* L7 — Nebula clouds (deep in back) */}
      <NebulaClouds />

      {/* L4 — Aurora light bands */}
      <AuroraBands />

      {/* L8 — Light rays from center */}
      <LightRays />

      {/* Radial glow (existing) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] sm:w-[1200px] sm:h-[1200px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%)" }}
      />

      {/* L5 — Sacred geometry */}
      <SacredGeometry />

      {/* L2 — Concentric pulsing rings (existing) */}
      <ConcentricRings />

      {/* L3 — Floating particle field */}
      {mounted && <ParticleField />}

      {/* L6 — Shooting stars */}
      {mounted && <ShootingStars />}

      {/* L9 — Mouse-tracking glow */}
      {mounted && <MouseGlow />}

      {/* L1 — Orbiting terms (existing) */}
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
