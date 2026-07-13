"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ComingSoonProps {
  /** Small eyebrow label — the section name, e.g. "Magazines". */
  section: string;
  /** Big animated headline, e.g. "The print edition". */
  headline: string;
  /** Shimmering subline that completes the message, e.g. "is coming Soon". */
  tagline: string;
  /** Muted supporting sentence. */
  note?: string;
  /** Optional call-to-action link shown under the note. */
  cta?: { label: string; href: string };
}

// A handful of drifting gold motes. Deterministic so SSR and client match.
const MOTES = [
  { l: 8, d: 0, dur: 9, s: 3 },
  { l: 18, d: 2.5, dur: 11, s: 2 },
  { l: 27, d: 5, dur: 8, s: 4 },
  { l: 38, d: 1.2, dur: 12, s: 2 },
  { l: 46, d: 6.5, dur: 10, s: 3 },
  { l: 55, d: 3.4, dur: 13, s: 2 },
  { l: 63, d: 0.6, dur: 9.5, s: 3 },
  { l: 72, d: 4.2, dur: 11.5, s: 2 },
  { l: 80, d: 2, dur: 8.5, s: 4 },
  { l: 88, d: 5.8, dur: 12.5, s: 2 },
  { l: 94, d: 1.8, dur: 10.5, s: 3 },
  { l: 33, d: 7, dur: 14, s: 2 },
];

export default function ComingSoon({
  section,
  headline,
  tagline,
  note,
  cta,
}: ComingSoonProps) {
  const words = headline.split(" ");
  let charIndex = 0;

  return (
    <section className="cs-root relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden px-4 py-20">
      {/* Ambient aurora blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="cs-aurora cs-aurora--1" />
        <span className="cs-aurora cs-aurora--2" />
        <span className="cs-aurora cs-aurora--3" />
        <span className="cs-dots absolute inset-0" />
      </div>

      {/* Slowly rotating halo behind the headline */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="cs-halo" />
      </div>

      {/* Drifting motes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="cs-mote"
            style={{
              left: `${m.l}%`,
              width: m.s,
              height: m.s,
              animationDelay: `${m.d}s`,
              animationDuration: `${m.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 flex justify-center"
        >
          <span className="cs-chip">
            <span className="cs-chip-dot" />
            <span className="relative z-10">{section}</span>
            <span className="cs-chip-shine" aria-hidden />
          </span>
        </motion.div>

        {/* Headline — letter-by-letter reveal with a travelling gold shimmer */}
        <motion.h1
          className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04, delayChildren: 0.18 } },
          }}
          aria-label={headline}
        >
          {words.map((word, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap align-top">
              {word.split("").map((ch) => {
                const idx = charIndex++;
                return (
                  <motion.span
                    key={idx}
                    aria-hidden
                    className="cs-letter inline-block"
                    style={{ animationDelay: `${idx * -0.09}s` }}
                    variants={{
                      hidden: { opacity: 0, y: "0.6em", filter: "blur(10px)" },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="cs-tagline mt-3 font-display text-2xl font-medium italic sm:text-3xl"
        >
          {tagline}
        </motion.p>

        {/* Indeterminate progress shimmer */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cs-bar mx-auto mt-9 h-[3px] w-40 origin-center overflow-hidden rounded-full"
        >
          <span className="cs-bar-glow" />
        </motion.div>

        {/* Note + CTA */}
        {(note || cta) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            {note && (
              <p className="mx-auto max-w-md text-base leading-relaxed text-mag-muted">
                {note}
              </p>
            )}
            {cta && (
              <Link
                href={cta.href}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-gold-400 transition-colors hover:text-gold-300"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        )}
      </div>

      <style>{`
        .cs-root { background: radial-gradient(120% 90% at 50% -10%, color-mix(in oklab, var(--color-gold-400) 8%, transparent), transparent 60%); }

        .cs-aurora {
          position: absolute; border-radius: 50%;
          filter: blur(40px); opacity: 0.5; will-change: transform;
        }
        .cs-aurora--1 {
          width: 46vmax; height: 46vmax; left: -12vmax; top: -14vmax;
          background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-gold-400) 34%, transparent), transparent 62%);
          animation: csAurora1 22s ease-in-out infinite;
        }
        .cs-aurora--2 {
          width: 40vmax; height: 40vmax; right: -14vmax; top: 8vmax;
          background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-gold-300) 26%, transparent), transparent 62%);
          animation: csAurora2 26s ease-in-out infinite;
        }
        .cs-aurora--3 {
          width: 38vmax; height: 38vmax; left: 30%; bottom: -18vmax;
          background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-gold-500) 22%, transparent), transparent 64%);
          animation: csAurora3 30s ease-in-out infinite;
        }
        .cs-dots {
          background-image: radial-gradient(color-mix(in oklab, var(--color-gold-400) 26%, transparent) 1px, transparent 1.4px);
          background-size: 26px 26px; opacity: 0.14;
          -webkit-mask-image: radial-gradient(70% 60% at 50% 45%, #000, transparent 78%);
          mask-image: radial-gradient(70% 60% at 50% 45%, #000, transparent 78%);
        }
        .cs-halo {
          width: min(80vw, 620px); aspect-ratio: 1; border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0%, color-mix(in oklab, var(--color-gold-400) 55%, transparent) 12%, transparent 30%, transparent 55%, color-mix(in oklab, var(--color-gold-300) 45%, transparent) 66%, transparent 82%, transparent 100%);
          -webkit-mask: radial-gradient(closest-side, transparent 63%, #000 65%, #000 72%, transparent 74%);
          mask: radial-gradient(closest-side, transparent 63%, #000 65%, #000 72%, transparent 74%);
          opacity: 0.35; filter: blur(2px); will-change: transform;
          animation: csSpin 24s linear infinite;
        }
        .cs-mote {
          position: absolute; bottom: -6%; border-radius: 50%;
          background: var(--color-gold-300);
          box-shadow: 0 0 8px color-mix(in oklab, var(--color-gold-300) 80%, transparent);
          opacity: 0; will-change: transform, opacity;
          animation-name: csRise; animation-timing-function: ease-in-out; animation-iteration-count: infinite;
        }
        .cs-chip {
          position: relative; display: inline-flex; align-items: center; gap: 0.6rem;
          overflow: hidden; border-radius: 9999px;
          border: 1px solid color-mix(in oklab, var(--color-gold-400) 40%, transparent);
          background: color-mix(in oklab, var(--color-gold-400) 8%, transparent);
          padding: 0.42rem 1rem 0.42rem 0.85rem;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--color-gold-300);
        }
        .cs-chip-dot {
          position: relative; z-index: 10; width: 7px; height: 7px; border-radius: 50%;
          background: var(--color-gold-400);
          box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-gold-400) 70%, transparent);
          animation: csPulse 2.4s ease-out infinite;
        }
        .cs-chip-shine {
          position: absolute; inset: 0; transform: translateX(-120%);
          background: linear-gradient(105deg, transparent, color-mix(in oklab, var(--color-gold-100) 55%, transparent), transparent);
          animation: csSweep 4.6s ease-in-out infinite;
        }
        .cs-letter {
          background: linear-gradient(92deg, var(--color-gold-300) 0%, var(--color-gold-100) 22%, var(--color-gold-400) 46%, var(--color-gold-100) 70%, var(--color-gold-300) 100%);
          background-size: 220% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          text-shadow: 0 1px 30px color-mix(in oklab, var(--color-gold-400) 22%, transparent);
          animation: csShine 3s linear infinite;
        }
        .cs-tagline {
          background: linear-gradient(92deg, color-mix(in oklab, var(--color-mag-light) 92%, var(--color-gold-200)), var(--color-gold-300), color-mix(in oklab, var(--color-mag-light) 92%, var(--color-gold-200)));
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: csShine 5s linear infinite;
        }
        .cs-bar { background: color-mix(in oklab, var(--color-gold-400) 16%, transparent); }
        .cs-bar-glow {
          display: block; height: 100%; width: 45%; border-radius: 9999px;
          background: linear-gradient(90deg, transparent, var(--color-gold-300), var(--color-gold-400), transparent);
          box-shadow: 0 0 12px color-mix(in oklab, var(--color-gold-400) 60%, transparent);
          transform: translateX(-120%);
          animation: csBar 2.1s cubic-bezier(0.65,0,0.35,1) infinite;
        }

        @keyframes csAurora1 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(6vmax,4vmax,0) scale(1.14); } }
        @keyframes csAurora2 { 0%,100% { transform: translate3d(0,0,0) scale(1.05); } 50% { transform: translate3d(-5vmax,3vmax,0) scale(0.92); } }
        @keyframes csAurora3 { 0%,100% { transform: translate3d(0,0,0) scale(0.95); } 50% { transform: translate3d(-4vmax,-5vmax,0) scale(1.12); } }
        @keyframes csSpin { to { transform: rotate(360deg); } }
        @keyframes csShine { to { background-position: -220% center; } }
        @keyframes csSweep { 0% { transform: translateX(-120%); } 45%,100% { transform: translateX(240%); } }
        @keyframes csPulse { 0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-gold-400) 65%, transparent); } 70%,100% { box-shadow: 0 0 0 9px transparent; } }
        @keyframes csBar { 0% { transform: translateX(-130%); } 100% { transform: translateX(360%); } }
        @keyframes csRise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          12% { opacity: 0.9; }
          85% { opacity: 0.6; }
          100% { transform: translateY(-108vh) scale(1); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-aurora, .cs-halo, .cs-mote, .cs-chip-shine, .cs-chip-dot,
          .cs-letter, .cs-tagline, .cs-bar-glow { animation: none !important; }
          .cs-letter { background-position: 0 center; }
          .cs-mote { display: none; }
        }
      `}</style>
    </section>
  );
}
