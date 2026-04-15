"use client";

import { useState, useEffect, useMemo } from "react";
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
   LAYER 2 — Concentric pulsing rings (existing)
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
   LAYER 3 — Particles (lightweight CSS animation)
   Fewer particles, CSS keyframes on compositor thread
   ═══════════════════════════════════════════════════════════════════════════ */

interface Mote {
  x: number; y: number; r: number;
  dur: number; del: number;
  peak: number; bright: boolean;
}

function Particles() {
  const motes = useMemo<Mote[]>(() => {
    const out: Mote[] = [];
    for (let i = 0; i < 18; i++) {
      out.push({
        x: Math.random() * 100, y: Math.random() * 100,
        r: 0.5 + Math.random() * 1,
        dur: 14 + Math.random() * 16,
        del: Math.random() * 10,
        peak: 0.15 + Math.random() * 0.15,
        bright: false,
      });
    }
    for (let i = 0; i < 5; i++) {
      out.push({
        x: 15 + Math.random() * 70, y: 15 + Math.random() * 70,
        r: 1.5 + Math.random() * 1.5,
        dur: 16 + Math.random() * 10,
        del: Math.random() * 6,
        peak: 0.35 + Math.random() * 0.25,
        bright: true,
      });
    }
    return out;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {motes.map((m, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.r * 2,
            height: m.r * 2,
            background: m.bright
              ? `radial-gradient(circle, rgba(255,235,180,${m.peak}) 0%, rgba(212,175,55,${m.peak * 0.4}) 50%, transparent 100%)`
              : `rgba(212,175,55,${m.peak})`,
            boxShadow: m.bright
              ? `0 0 ${m.r * 4}px ${m.r}px rgba(212,175,55,${m.peak * 0.25})`
              : "none",
            animation: `particle-float-${i % 4} ${m.dur}s ease-in-out ${m.del}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 4 — Atmosphere (pure CSS, no SVG filters)
   Soft radial gradients with CSS animation for organic drift
   ═══════════════════════════════════════════════════════════════════════════ */

function Atmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary nebula — warm gold, upper zone */}
      <div
        className="absolute"
        style={{
          width: "100vw",
          height: "55vh",
          top: "-5%",
          left: "-5%",
          background:
            "radial-gradient(ellipse 80% 50% at 40% 50%, rgba(212,175,55,0.04) 0%, rgba(180,140,30,0.015) 40%, transparent 70%)",
          filter: "blur(50px)",
          animation: "nebula-drift-1 45s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Secondary nebula — champagne, lower zone */}
      <div
        className="absolute"
        style={{
          width: "85vw",
          height: "45vh",
          bottom: "-8%",
          right: "-5%",
          background:
            "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(225,200,120,0.03) 0%, rgba(200,170,60,0.012) 45%, transparent 70%)",
          filter: "blur(50px)",
          animation: "nebula-drift-2 55s ease-in-out 8s infinite",
          willChange: "transform",
        }}
      />

      {/* Central core glow */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 550,
          height: 550,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 30%, rgba(180,140,30,0.008) 50%, transparent 65%)",
          filter: "blur(30px)",
          animation: "core-pulse 12s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 5 — Aurora veils (pure CSS, lightweight)
   Two soft bands with CSS keyframe animation
   ═══════════════════════════════════════════════════════════════════════════ */

function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Band 1 — broad, upper */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: 300,
          top: "15%",
          left: "-20%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.015) 20%, rgba(225,200,120,0.03) 45%, rgba(212,175,55,0.015) 70%, transparent 100%)",
          filter: "blur(20px)",
          animation: "aurora-sway-1 30s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Band 2 — narrower, mid */}
      <div
        style={{
          position: "absolute",
          width: "120%",
          height: 180,
          top: "48%",
          left: "-10%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(180,150,50,0.01) 25%, rgba(212,175,55,0.025) 45%, rgba(255,235,180,0.02) 55%, rgba(212,175,55,0.012) 75%, transparent 100%)",
          filter: "blur(16px)",
          animation: "aurora-sway-2 24s ease-in-out 5s infinite",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 6 — Sacred geometry (unchanged, already lightweight)
   ═══════════════════════════════════════════════════════════════════════════ */

function SacredGeometry() {
  const petals = useMemo(() => {
    const r = 60;
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60 * Math.PI) / 180;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.svg
        width="260" height="260" viewBox="-130 -130 260 260"
        className="absolute"
        style={{ opacity: 0.06 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60"
          fill="none" stroke="rgba(212,175,55,1)" strokeWidth="0.5"
        />
      </motion.svg>

      <motion.svg
        width="180" height="180" viewBox="-90 -90 180 180"
        className="absolute"
        style={{ opacity: 0.05 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40"
          fill="none" stroke="rgba(212,175,55,1)" strokeWidth="0.5"
        />
      </motion.svg>

      <motion.svg
        width="200" height="200" viewBox="-100 -100 200 200"
        className="absolute"
        animate={{ opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(212,175,55,0.8)" strokeWidth="0.4" />
        {petals.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="60" fill="none" stroke="rgba(212,175,55,0.8)" strokeWidth="0.4" />
        ))}
      </motion.svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 7 — God rays (CSS-only, 6 rays instead of 12)
   Uses CSS animation on opacity only — no JS per-ray animation
   ═══════════════════════════════════════════════════════════════════════════ */

function GodRays() {
  const rays = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        angle: i * 60 + (i % 2) * 15,
        length: 350 + (i % 3) * 60,
        width: 8 + (i % 3) * 4,
        peak: 0.04 + (i % 3) * 0.015,
      })),
    []
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="relative"
        style={{
          width: 0,
          height: 0,
          animation: "godrays-rotate 80s ease-in-out infinite",
          willChange: "transform",
        }}
      >
        {rays.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: r.length,
              height: r.width,
              marginTop: -r.width / 2,
              transformOrigin: "left center",
              transform: `rotate(${r.angle}deg)`,
              background: `linear-gradient(90deg, rgba(212,175,55,${r.peak}) 0%, rgba(225,200,120,${r.peak * 0.5}) 40%, transparent 100%)`,
              filter: "blur(4px)",
              opacity: 0.5,
              animation: `ray-pulse ${8 + i * 2}s ease-in-out ${i * 1.2}s infinite`,
              willChange: "opacity",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 8 — Shooting stars (unchanged, already lightweight)
   ═══════════════════════════════════════════════════════════════════════════ */

function ShootingStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        x: 5 + i * 30 + Math.random() * 15,
        y: 3 + Math.random() * 25,
        angle: 20 + Math.random() * 25,
        travel: 200 + Math.random() * 150,
        dur: 0.8 + Math.random() * 0.5,
        gap: 18 + i * 12,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => {
        const cycle = s.gap + s.dur;
        const t1 = s.gap / cycle;
        const t2 = (s.gap + s.dur * 0.1) / cycle;
        const t3 = (s.gap + s.dur * 0.5) / cycle;
        const t4 = (s.gap + s.dur) / cycle;

        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.travel * 0.6,
              height: 1,
              transformOrigin: "left center",
              transform: `rotate(${s.angle}deg)`,
              background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 10%, rgba(225,210,150,0.5) 40%, rgba(255,252,240,0.9) 85%, white 100%)`,
              borderRadius: 2,
              filter: "blur(0.4px)",
            }}
            animate={{
              opacity: [0, 0, 0.9, 0.9, 0],
              scaleX: [0, 0, 0.4, 1, 0],
              x: [0, 0, 0, s.travel, s.travel],
            }}
            transition={{
              duration: cycle,
              times: [0, t1, t2, t3, t4],
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 9 — Mouse-tracking glow (single layer, lighter)
   ═══════════════════════════════════════════════════════════════════════════ */

function MouseGlow() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const cfg = { stiffness: 20, damping: 30 };
  const sx = useSpring(mx, cfg);
  const sy = useSpring(my, cfg);

  const gx = useTransform(sx, [0, 1], ["-5%", "105%"]);
  const gy = useTransform(sy, [0, 1], ["-5%", "105%"]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, [mx, my]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 500,
        height: 500,
        left: gx,
        top: gy,
        x: "-50%",
        y: "-50%",
        background:
          "radial-gradient(circle, rgba(212,175,55,0.03) 0%, rgba(200,165,40,0.012) 35%, transparent 60%)",
        filter: "blur(40px)",
        willChange: "transform",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CSS KEYFRAMES — All light animations on compositor thread
   ═══════════════════════════════════════════════════════════════════════════ */

function LightKeyframes() {
  return (
    <style jsx global>{`
      @keyframes nebula-drift-1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(30px, -12px) scale(1.05); }
        50% { transform: translate(-15px, 15px) scale(0.97); }
        75% { transform: translate(20px, -8px) scale(1.03); }
      }
      @keyframes nebula-drift-2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        30% { transform: translate(-25px, 15px) scale(1.04); }
        60% { transform: translate(15px, -10px) scale(1.08); }
        80% { transform: translate(-10px, 5px) scale(0.98); }
      }
      @keyframes core-pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.85; }
      }
      @keyframes aurora-sway-1 {
        0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); opacity: 0.7; }
        25% { transform: translateY(-18px) scaleY(1.1) rotate(1deg); opacity: 1; }
        50% { transform: translateY(10px) scaleY(0.92) rotate(-0.5deg); opacity: 0.6; }
        75% { transform: translateY(-8px) scaleY(1.04) rotate(0.3deg); opacity: 0.85; }
      }
      @keyframes aurora-sway-2 {
        0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); opacity: 0.5; }
        30% { transform: translateY(15px) scaleY(0.88) rotate(-0.8deg); opacity: 0.8; }
        60% { transform: translateY(-10px) scaleY(1.08) rotate(0.6deg); opacity: 0.55; }
        85% { transform: translateY(6px) scaleY(0.96) rotate(-0.3deg); opacity: 0.7; }
      }
      @keyframes godrays-rotate {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(6deg); }
        50% { transform: rotate(-3deg); }
        75% { transform: rotate(4deg); }
      }
      @keyframes ray-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
      @keyframes particle-float-0 {
        0%, 100% { transform: translate(0, 0); opacity: 0; }
        20% { opacity: 0.6; }
        50% { transform: translate(12px, -8px); opacity: 1; }
        80% { opacity: 0.4; }
      }
      @keyframes particle-float-1 {
        0%, 100% { transform: translate(0, 0); opacity: 0; }
        25% { opacity: 0.5; }
        50% { transform: translate(-10px, 14px); opacity: 1; }
        75% { opacity: 0.3; }
      }
      @keyframes particle-float-2 {
        0%, 100% { transform: translate(0, 0); opacity: 0; }
        15% { opacity: 0.7; }
        50% { transform: translate(8px, 10px); opacity: 1; }
        85% { opacity: 0.5; }
      }
      @keyframes particle-float-3 {
        0%, 100% { transform: translate(0, 0); opacity: 0; }
        30% { opacity: 0.4; }
        50% { transform: translate(-14px, -6px); opacity: 1; }
        70% { opacity: 0.6; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
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
      {/* CSS keyframe definitions */}
      <LightKeyframes />

      {/* Atmospheric nebulae (CSS-only) */}
      <Atmosphere />

      {/* Aurora veils (CSS-only) */}
      <Aurora />

      {/* God rays (CSS-only, 6 rays) */}
      <GodRays />

      {/* Radial core glow (static) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] sm:w-[1200px] sm:h-[1200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(200,165,40,0.03) 30%, transparent 60%)",
        }}
      />

      {/* Sacred geometry */}
      <SacredGeometry />

      {/* Concentric rings */}
      <ConcentricRings />

      {/* Particles (CSS-animated) */}
      {mounted && <Particles />}

      {/* Shooting stars */}
      {mounted && <ShootingStars />}

      {/* Mouse glow (single layer) */}
      {mounted && <MouseGlow />}

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
