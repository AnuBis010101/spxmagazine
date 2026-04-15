"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   SVG FILTERS — Organic noise texture for premium light effects
   These create the difference between "CSS gradient" and "real light".
   ═══════════════════════════════════════════════════════════════════════════ */

function NoiseFilters() {
  return (
    <svg className="absolute" width="0" height="0" aria-hidden="true">
      <defs>
        {/* Organic displacement for nebulae — makes blobs feel gaseous */}
        <filter id="nebula-warp" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves={4}
            seed={42}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={80}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Finer noise for aurora bands */}
        <filter id="aurora-warp" x="-20%" y="-50%" width="140%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.003"
            numOctaves={3}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={50}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Soft grain overlay — adds film-like texture */}
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={1}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}

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
   LAYER 3 — Particle constellation
   Two classes: dim background dust + bright foreground embers
   ═══════════════════════════════════════════════════════════════════════════ */

interface Mote {
  x: number; y: number; r: number;
  dx: number; dy: number;
  dur: number; del: number;
  peak: number; bright: boolean;
}

function Particles() {
  const motes = useMemo<Mote[]>(() => {
    const out: Mote[] = [];
    // Background dust — many, tiny, dim
    for (let i = 0; i < 35; i++) {
      out.push({
        x: Math.random() * 100, y: Math.random() * 100,
        r: 0.5 + Math.random() * 1,
        dx: (Math.random() - 0.5) * 20,
        dy: (Math.random() - 0.5) * 20,
        dur: 12 + Math.random() * 18,
        del: Math.random() * 10,
        peak: 0.12 + Math.random() * 0.15,
        bright: false,
      });
    }
    // Foreground embers — few, larger, glow
    for (let i = 0; i < 8; i++) {
      out.push({
        x: 15 + Math.random() * 70, y: 15 + Math.random() * 70,
        r: 1.5 + Math.random() * 2,
        dx: (Math.random() - 0.5) * 40,
        dy: (Math.random() - 0.5) * 40,
        dur: 15 + Math.random() * 10,
        del: Math.random() * 6,
        peak: 0.35 + Math.random() * 0.3,
        bright: true,
      });
    }
    return out;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {motes.map((m, i) => (
        <motion.div
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
              ? `0 0 ${m.r * 6}px ${m.r * 2}px rgba(212,175,55,${m.peak * 0.3})`
              : "none",
          }}
          animate={{
            x: [0, m.dx * 0.6, m.dx, m.dx * 0.3, 0],
            y: [0, m.dy * 0.4, m.dy, m.dy * 0.7, 0],
            opacity: [0, m.peak * 0.6, m.peak, m.peak * 0.4, 0],
          }}
          transition={{
            duration: m.dur,
            delay: m.del,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 4 — Atmospheric nebulae (SVG noise-warped)
   Multiple overlapping organic blobs with colour variation
   ═══════════════════════════════════════════════════════════════════════════ */

function Atmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary nebula — warm gold, upper zone */}
      <motion.div
        style={{
          position: "absolute",
          width: "110vw",
          height: "60vh",
          top: "-5%",
          left: "-5%",
          background:
            "radial-gradient(ellipse 80% 50% at 40% 50%, rgba(212,175,55,0.035) 0%, rgba(180,140,30,0.015) 40%, transparent 70%)",
          filter: "url(#nebula-warp) blur(80px)",
        }}
        animate={{
          x: [0, 40, -20, 30, 0],
          y: [0, -15, 20, -10, 0],
          scale: [1, 1.08, 0.96, 1.04, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary nebula — champagne, lower zone */}
      <motion.div
        style={{
          position: "absolute",
          width: "90vw",
          height: "50vh",
          bottom: "-8%",
          right: "-5%",
          background:
            "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(225,200,120,0.025) 0%, rgba(200,170,60,0.01) 45%, transparent 70%)",
          filter: "url(#nebula-warp) blur(90px)",
        }}
        animate={{
          x: [0, -30, 20, -15, 0],
          y: [0, 20, -15, 8, 0],
          scale: [1, 1.05, 1.1, 0.97, 1],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />

      {/* Deep bronze accent — mid-left */}
      <motion.div
        style={{
          position: "absolute",
          width: "50vw",
          height: "40vh",
          top: "30%",
          left: "-8%",
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(140,111,34,0.03) 0%, rgba(100,80,20,0.01) 50%, transparent 75%)",
          filter: "url(#nebula-warp) blur(70px)",
        }}
        animate={{
          x: [0, 25, -10, 15, 0],
          y: [0, -20, 30, -5, 0],
          opacity: [0.7, 1, 0.6, 0.9, 0.7],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 15 }}
      />

      {/* Central core glow — layered */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 600,
          height: 600,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 30%, rgba(180,140,30,0.008) 50%, transparent 65%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.12, 1.04, 1.08, 1],
          opacity: [0.6, 0.85, 0.7, 0.9, 0.6],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 5 — Aurora veils (noise-warped, multi-band)
   ═══════════════════════════════════════════════════════════════════════════ */

function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Band 1 — broad, slow, upper */}
      <motion.div
        style={{
          position: "absolute",
          width: "160%",
          height: 400,
          top: "12%",
          left: "-30%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.012) 15%, rgba(225,200,120,0.03) 35%, rgba(212,175,55,0.04) 50%, rgba(200,165,40,0.025) 65%, rgba(212,175,55,0.01) 80%, transparent 100%)",
          filter: "url(#aurora-warp) blur(30px)",
          transformOrigin: "50% 50%",
        }}
        animate={{
          rotate: [0, 1.5, -0.8, 0.5, 0],
          y: [0, -25, 15, -8, 0],
          scaleY: [1, 1.15, 0.9, 1.05, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Band 2 — narrower, faster, mid */}
      <motion.div
        style={{
          position: "absolute",
          width: "140%",
          height: 250,
          top: "42%",
          left: "-20%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(180,150,50,0.008) 20%, rgba(212,175,55,0.025) 40%, rgba(255,235,180,0.03) 50%, rgba(212,175,55,0.02) 60%, rgba(180,150,50,0.008) 80%, transparent 100%)",
          filter: "url(#aurora-warp) blur(25px)",
          transformOrigin: "50% 50%",
        }}
        animate={{
          rotate: [0, -1, 1.2, -0.5, 0],
          y: [0, 20, -12, 8, 0],
          scaleY: [1, 0.85, 1.1, 0.95, 1],
          opacity: [0.5, 0.9, 0.6, 0.8, 0.5],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Band 3 — whisper-thin accent */}
      <motion.div
        style={{
          position: "absolute",
          width: "120%",
          height: 120,
          top: "65%",
          left: "-10%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(225,200,120,0.015) 30%, rgba(255,240,200,0.025) 50%, rgba(225,200,120,0.015) 70%, transparent 100%)",
          filter: "url(#aurora-warp) blur(20px)",
          transformOrigin: "50% 50%",
        }}
        animate={{
          rotate: [0, 0.8, -1.2, 0.3, 0],
          y: [0, -15, 10, -5, 0],
          opacity: [0.4, 0.7, 0.3, 0.6, 0.4],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 12 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 6 — Sacred geometry
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
   LAYER 7 — Volumetric god rays
   Tapered cones fanning from centre with organic width variation
   ═══════════════════════════════════════════════════════════════════════════ */

function GodRays() {
  const rays = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30) + (i % 3) * 5 - 7;
        const length = 300 + (i % 4) * 80 + (i % 3) * 50;
        return {
          angle,
          length,
          widthEnd: 6 + (i % 5) * 4,
          peakOpacity: 0.015 + (i % 3) * 0.008,
          dur: 7 + (i % 4) * 2.5,
          del: (i % 5) * 1.3,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative"
        style={{ width: 0, height: 0 }}
        animate={{ rotate: [0, 8, -4, 6, 0] }}
        transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
      >
        {rays.map((r, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: -0.5,
              width: r.length,
              height: 1,
              transformOrigin: "left center",
              transform: `rotate(${r.angle}deg)`,
            }}
          >
            {/* The cone: a div that widens from 1px to widthEnd */}
            <motion.div
              style={{
                width: "100%",
                clipPath: `polygon(0% 50%, 100% ${50 - r.widthEnd / 2}%, 100% ${50 + r.widthEnd / 2}%)`,
                background: `linear-gradient(90deg, rgba(212,175,55,${r.peakOpacity * 2}) 0%, rgba(225,200,120,${r.peakOpacity}) 40%, rgba(255,240,200,${r.peakOpacity * 0.3}) 70%, transparent 100%)`,
                filter: "blur(3px)",
                height: r.widthEnd * 2,
                marginTop: -r.widthEnd,
              }}
              animate={{
                opacity: [r.peakOpacity * 8, r.peakOpacity * 20, r.peakOpacity * 8],
              }}
              transition={{
                duration: r.dur,
                delay: r.del,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 8 — Shooting stars (rare, elegant)
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
   LAYER 9 — Mouse-tracking glow (layered halos)
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
    <>
      {/* Outer soft halo */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 700,
          height: 700,
          left: gx,
          top: gy,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.025) 0%, rgba(200,165,40,0.01) 35%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      {/* Inner warm core */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          left: gx,
          top: gy,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(255,235,180,0.03) 0%, rgba(212,175,55,0.015) 40%, transparent 65%)",
          filter: "blur(30px)",
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYER 10 — Film grain overlay (texture, not pattern)
   ═══════════════════════════════════════════════════════════════════════════ */

function FilmGrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none mix-blend-soft-light"
      style={{
        opacity: 0.04,
        filter: "url(#grain)",
      }}
    />
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
      {/* SVG filter definitions */}
      <NoiseFilters />

      {/* Deepest layer — atmospheric nebulae (noise-warped) */}
      <Atmosphere />

      {/* Aurora veils (noise-warped bands) */}
      <Aurora />

      {/* Volumetric god rays */}
      <GodRays />

      {/* Radial core glow (existing) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] sm:w-[1200px] sm:h-[1200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(200,165,40,0.03) 30%, transparent 60%)",
        }}
      />

      {/* Sacred geometry */}
      <SacredGeometry />

      {/* Concentric rings (existing) */}
      <ConcentricRings />

      {/* Particles */}
      {mounted && <Particles />}

      {/* Shooting stars */}
      {mounted && <ShootingStars />}

      {/* Mouse glow */}
      {mounted && <MouseGlow />}

      {/* Film grain (topmost) */}
      {mounted && <FilmGrain />}

      {/* Orbiting terms (existing) */}
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
