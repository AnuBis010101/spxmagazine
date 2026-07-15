"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Play, Radio } from "lucide-react";

/** Brand-accurate YouTube glyph (lucide has no Youtube icon in this version). */
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   The Cognisphere on air — SPX6900 podcasts & shows.

   Each channel is a cursor-tilting card: a latest-episode preview with a
   pulsing play button, an "on-air" avatar ringed with a rotating accent halo,
   a live audio equalizer (the signature podcast flourish), a specular sweep,
   and an accent-lit living border. Themed per channel.

   Motion is transform/opacity only, reduced-motion guarded. The tilt lives on
   an INNER layer while :hover + overflow sit on the stable frame, so hovering
   never flickers. Card backgrounds are opaque (no stacked backdrop-blur) to
   keep scroll smooth.
   ──────────────────────────────────────────────────────────────────────── */

type Podcast = {
  id: string;
  name: string;
  format: string;
  tagline: string;
  blurb: string;
  channelUrl: string;
  latestUrl: string;
  cover: { src: string; alt: string };
  avatar: { src: string; alt: string };
  chips: string[];
  accent: string;
  accent2: string;
};

const PODCASTS: Podcast[] = [
  {
    id: "flip",
    name: "Flip The Stock Market",
    format: "Video podcast",
    tagline: "The unexplored side of crypto",
    blurb:
      "Deep, thought-provoking conversations: four co-hosts and guests digging into the corners of crypto nobody else covers.",
    channelUrl: "https://youtube.com/@flipthestockmarket",
    latestUrl: "https://youtube.com/watch?v=AKslD8AxFfE",
    cover: { src: "/podcasts/flip-latest.jpg", alt: "Flip The Stock Market — latest episode" },
    avatar: { src: "/podcasts/flip-avatar.jpg", alt: "Flip The Stock Market" },
    chips: ["4 co-hosts", "Guests", "Crypto"],
    accent: "#2FD576",
    accent2: "#8DF4B7",
  },
  {
    id: "big6900",
    name: "Big6900",
    format: "X Spaces, recorded",
    tagline: "The community, on the record",
    blurb:
      "Recordings of the SPX6900 Spaces on X: the timeline's live conversations, archived for the whole Cognisphere.",
    channelUrl: "https://youtube.com/@big6900_spx",
    latestUrl: "https://youtube.com/watch?v=eUOu8CimcwA",
    cover: { src: "/podcasts/big6900-latest.jpg", alt: "Big6900 — latest Spaces recording" },
    avatar: { src: "/podcasts/big6900-avatar.jpg", alt: "Big6900" },
    chips: ["X Spaces", "Community", "Archive"],
    accent: "#F0B429",
    accent2: "#FFE08C",
  },
  {
    id: "persist",
    name: "Persist Forever",
    format: "Weekly show",
    tagline: "Into the Cognisphere, every week",
    blurb:
      "Southern Fried Chad and co-hosts go Into the Cognisphere every Tuesday at 8PM ET. Believe in something. Persist forever.",
    channelUrl: "https://youtube.com/@southernfriedchad",
    latestUrl: "https://youtube.com/watch?v=ul0th4dQrJo",
    cover: { src: "/podcasts/chad-latest.jpg", alt: "Persist Forever — latest highlight" },
    avatar: { src: "/podcasts/chad-avatar.jpg", alt: "Persist Forever" },
    chips: ["Tues 8PM ET", "Co-hosts", "Weekly"],
    accent: "#9B7BFF",
    accent2: "#CBB8FF",
  },
];

/* Deterministic bar heights for the hero waveform (SSR-safe). */
const WAVE = [0.35, 0.6, 0.85, 0.5, 0.95, 0.7, 0.4, 0.8, 0.55, 0.9, 0.45, 0.75, 0.6, 0.3, 0.88, 0.5, 0.7, 0.4, 0.82, 0.58, 0.92, 0.48, 0.68, 0.38];

export default function PodcastShowcase() {
  return (
    <section className="pc-page relative mx-auto w-full max-w-6xl px-4 pb-28 pt-14 sm:pt-20">
      <PodcastHero />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-3 lg:gap-7">
        {PODCASTS.map((p, i) => (
          <PodcastCard key={p.id} podcast={p} order={i} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-16 max-w-xl text-center text-sm leading-relaxed text-mag-muted"
      >
        The Cognisphere talks. Press play, hit subscribe, and let the Aeons do the yapping.
      </motion.p>

      <PodcastStyles />
    </section>
  );
}

/* ── Equalizer (the signature "audio is playing" flourish) ─────────────── */

function Equalizer({ bars = 5 }: { bars?: number }) {
  return (
    <span aria-hidden className="pc-eq">
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} className="pc-eq-bar" style={{ animationDelay: `${(i % bars) * -0.28}s` }} />
      ))}
    </span>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */

function PodcastHero() {
  return (
    <header className="relative text-center">
      {/* animated waveform ribbon behind the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 flex -translate-y-1/2 items-center justify-center gap-[3px] opacity-[0.13]">
        {WAVE.map((h, i) => (
          <span
            key={i}
            className="pc-wave-bar"
            style={{ ["--h" as string]: h, animationDelay: `${i * -0.13}s` }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex justify-center"
      >
        <span className="pc-eyebrow">
          <span className="pc-eyebrow-dot" />
          Cognisphere Radio
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="pc-title relative z-10 mt-6 font-display text-[2.7rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]"
      >
        SPX6900 On Air
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto mt-5 max-w-xl text-base leading-relaxed text-mag-muted sm:text-lg"
      >
        The podcasts, Spaces, and weekly shows carrying the SPX6900 signal. Tune in, catch up, and
        believe out loud.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2.5"
      >
        {["3 shows", "Video podcasts", "X Spaces", "Weekly"].map((s) => (
          <span key={s} className="pc-stat">
            {s}
          </span>
        ))}
      </motion.div>
    </header>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function PodcastCard({ podcast, order }: { podcast: Podcast; order: number }) {
  const reduce = useReducedMotion();
  // Ref on the OUTER, untransformed shell — never the tilting layer.
  const shellRef = useRef<HTMLElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 16, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 140, damping: 16, mass: 0.4 });
  const TILT = 6;
  const rotateY = useTransform(sx, [0, 1], [-TILT, TILT]);
  const rotateX = useTransform(sy, [0, 1], [TILT, -TILT]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(260px circle at ${glareX} ${glareY}, rgba(255,255,255,0.13), transparent 60%)`;

  function onMove(e: React.PointerEvent) {
    if (reduce) return;
    const el = shellRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
    py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.article
      ref={shellRef}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: order * 0.08 + 0.04, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="pc-shell"
      style={{ ["--accent" as string]: podcast.accent, ["--accent-2" as string]: podcast.accent2 }}
    >
      <div className="pc-card group/pc">
        <span aria-hidden className="pc-ring" />

        <motion.div
          className="pc-tilt"
          style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: "preserve-3d" }}
        >
          {/* ── Cover: latest episode + play ── */}
          <div className="pc-cover" style={{ transform: "translateZ(1px)" }}>
            <Image
              src={podcast.cover.src}
              alt={podcast.cover.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 380px"
              className="pc-cover-img object-cover"
            />
            <span aria-hidden className="pc-cover-scrim" />
            <span aria-hidden className="pc-shine" />
            {!reduce && <motion.span aria-hidden className="pc-glare" style={{ backgroundImage: glare }} />}

            <span className="pc-format" style={{ transform: "translateZ(40px)" }}>
              <Radio className="h-3 w-3" />
              {podcast.format}
            </span>
            <span className="pc-yt" style={{ transform: "translateZ(40px)" }}>
              <YouTubeIcon className="h-3.5 w-3.5" />
            </span>

            {/* pulsing play button → latest episode */}
            <a
              href={podcast.latestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pc-play"
              style={{ transform: "translateZ(55px)" }}
              aria-label={`Play the latest episode of ${podcast.name}`}
            >
              <span aria-hidden className="pc-play-ripple" />
              <span aria-hidden className="pc-play-ripple pc-play-ripple--2" />
              <Play className="pc-play-icon h-5 w-5" fill="currentColor" />
            </a>

            <Equalizer />
          </div>

          {/* ── Body ── */}
          <div className="pc-body" style={{ transform: "translateZ(24px)" }}>
            <div className="flex items-center gap-3">
              <span className="pc-avatar">
                <span aria-hidden className="pc-avatar-ring" />
                <Image src={podcast.avatar.src} alt={podcast.avatar.alt} width={44} height={44} />
                <span aria-hidden className="pc-onair" />
              </span>
              <div className="min-w-0">
                <a
                  href={podcast.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pc-name font-display text-base font-bold tracking-tight sm:text-lg"
                >
                  {podcast.name}
                </a>
                <p className="pc-tagline text-[0.8rem] font-medium italic">{podcast.tagline}</p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-mag-muted">{podcast.blurb}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {podcast.chips.map((c) => (
                <span key={c} className="pc-chip">
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={podcast.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-cta"
              >
                <YouTubeIcon className="h-4 w-4" />
                <span>Watch on YouTube</span>
                <ArrowUpRight className="pc-cta-arrow h-3.5 w-3.5" />
              </a>
              <a
                href={podcast.latestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-latest"
              >
                <Play className="h-3 w-3" fill="currentColor" />
                Latest
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

/* ── Scoped styles (themed per-card via var(--accent)) ─────────────────── */

function PodcastStyles() {
  return (
    <style>{`
      .pc-page { isolation: isolate; }

      /* hero */
      .pc-eyebrow {
        display: inline-flex; align-items: center; gap: 0.55rem;
        border-radius: 9999px; padding: 0.4rem 0.95rem;
        border: 1px solid color-mix(in oklab, var(--color-gold-400) 38%, transparent);
        background: color-mix(in oklab, var(--color-gold-400) 8%, transparent);
        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--color-gold-300);
      }
      .pc-eyebrow-dot {
        width: 6px; height: 6px; border-radius: 50%; background: #ff3b3b;
        box-shadow: 0 0 10px #ff3b3b; animation: pcPulse 1.8s ease-out infinite;
      }
      .pc-title {
        background: linear-gradient(94deg, var(--color-gold-200) 0%, var(--color-mag-white) 26%, var(--color-gold-300) 50%, var(--color-mag-white) 74%, var(--color-gold-200) 100%);
        background-size: 220% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        text-shadow: 0 2px 50px color-mix(in oklab, var(--color-gold-400) 20%, transparent);
        animation: pcShine 6s linear infinite;
      }
      .pc-stat {
        border-radius: 9999px; padding: 0.34rem 0.85rem;
        border: 1px solid var(--color-mag-border);
        background: color-mix(in oklab, var(--color-mag-white) 4%, transparent);
        font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; color: var(--color-mag-light);
      }
      .pc-wave-bar {
        width: 4px; height: calc(18px + var(--h) * 90px); border-radius: 9999px;
        background: linear-gradient(180deg, var(--color-gold-300), color-mix(in oklab, var(--color-gold-500) 60%, transparent));
        transform-origin: center; will-change: transform;
        animation: pcWave 1.5s ease-in-out infinite;
      }

      /* card shell / frame (stable, owns :hover) */
      .pc-shell { transform-style: preserve-3d; }
      .pc-card {
        position: relative; overflow: hidden; border-radius: 24px; perspective: 1200px;
        border: 1px solid color-mix(in oklab, var(--accent) 22%, var(--color-mag-border));
        background:
          radial-gradient(130% 90% at 50% -15%, color-mix(in oklab, var(--accent) 13%, transparent), transparent 58%),
          linear-gradient(180deg, color-mix(in oklab, var(--accent) 6%, #101011), #0a0a0b 62%);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-mag-white) 8%, transparent) inset,
                    0 20px 50px -30px rgba(0,0,0,0.9);
        transition: box-shadow 0.4s ease, border-color 0.4s ease;
      }
      .pc-card:hover {
        border-color: color-mix(in oklab, var(--accent) 55%, transparent);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-mag-white) 12%, transparent) inset,
                    0 32px 66px -34px color-mix(in oklab, var(--accent) 60%, black),
                    0 0 46px -10px color-mix(in oklab, var(--accent) 42%, transparent);
      }
      .pc-card:focus-within { outline: 2px solid color-mix(in oklab, var(--accent) 60%, transparent); outline-offset: 3px; }

      /* inner tilt layer — the only thing that rotates */
      .pc-tilt { position: relative; transform-style: preserve-3d; will-change: transform; }

      /* living accent ring */
      .pc-ring {
        position: absolute; inset: 0; border-radius: 24px; padding: 1px; z-index: 4;
        pointer-events: none; opacity: 0;
        background: conic-gradient(from 0deg, transparent 0deg,
          color-mix(in oklab, var(--accent) 85%, transparent) 60deg,
          color-mix(in oklab, var(--accent-2) 95%, transparent) 110deg,
          transparent 180deg, transparent 360deg);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        transition: opacity 0.4s ease;
      }
      .pc-card:hover .pc-ring { opacity: 1; animation: pcRingSpin 4.5s linear infinite; }

      /* cover */
      .pc-cover {
        position: relative; margin: 10px 10px 0; border-radius: 16px; overflow: hidden;
        aspect-ratio: 16 / 9; background: #060607;
      }
      .pc-cover-img { transition: transform 0.9s cubic-bezier(0.16,1,0.3,1); will-change: transform; }
      .pc-card:hover .pc-cover-img { transform: scale(1.07); }
      .pc-cover-scrim {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(6,6,7,0.15) 0%, transparent 30%, rgba(6,6,7,0.35) 78%, rgba(10,10,11,0.72) 100%);
      }
      .pc-glare { position: absolute; inset: 0; pointer-events: none; z-index: 3; mix-blend-mode: soft-light; }
      .pc-shine {
        position: absolute; inset: 0; z-index: 3; pointer-events: none;
        background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%);
        transform: translateX(-140%) skewX(-16deg);
      }
      .pc-card:hover .pc-shine { animation: pcShineSweep 0.95s cubic-bezier(0.4,0,0.2,1) forwards; }

      .pc-format {
        position: absolute; top: 10px; left: 10px; z-index: 6;
        display: inline-flex; align-items: center; gap: 0.32rem;
        border-radius: 9999px; padding: 0.26rem 0.6rem;
        font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
        color: color-mix(in oklab, var(--accent) 30%, #08110c);
        background: linear-gradient(135deg, var(--accent-2), var(--accent));
        box-shadow: 0 4px 14px -4px color-mix(in oklab, var(--accent) 70%, transparent);
      }
      .pc-format svg { color: color-mix(in oklab, var(--accent) 20%, #08110c); }
      .pc-yt {
        position: absolute; top: 10px; right: 10px; z-index: 6;
        display: inline-flex; align-items: center; justify-content: center;
        width: 26px; height: 26px; border-radius: 8px;
        background: #ff0000; color: #fff; box-shadow: 0 4px 14px -4px rgba(255,0,0,0.7);
      }

      /* play button */
      .pc-play {
        position: absolute; left: 50%; top: 50%; z-index: 6;
        transform: translate(-50%, -50%); transform-origin: center;
        display: grid; place-items: center; width: 56px; height: 56px; border-radius: 9999px;
        color: #0a0a0b; background: rgba(255,255,255,0.94);
        box-shadow: 0 10px 30px -8px rgba(0,0,0,0.7);
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, color 0.3s ease;
      }
      .pc-play-icon { margin-left: 2px; transition: transform 0.35s ease; }
      .pc-card:hover .pc-play {
        transform: translate(-50%, -50%) scale(1.08);
        background: linear-gradient(135deg, var(--accent-2), var(--accent)); color: #08110c;
      }
      .pc-play-ripple {
        position: absolute; inset: 0; border-radius: 9999px; pointer-events: none;
        border: 2px solid color-mix(in oklab, var(--accent) 70%, white);
        opacity: 0;
      }
      .pc-card:hover .pc-play-ripple { animation: pcRipple 1.8s ease-out infinite; }
      .pc-card:hover .pc-play-ripple--2 { animation-delay: 0.9s; }

      /* equalizer */
      .pc-eq {
        position: absolute; left: 12px; bottom: 12px; z-index: 6;
        display: flex; align-items: flex-end; gap: 3px; height: 20px;
      }
      .pc-eq-bar {
        width: 3px; height: 100%; border-radius: 9999px; transform-origin: bottom; transform: scaleY(0.3);
        background: linear-gradient(180deg, var(--accent-2), var(--accent));
        box-shadow: 0 0 8px color-mix(in oklab, var(--accent) 60%, transparent);
        animation: pcEq 1.1s ease-in-out infinite;
      }
      .pc-card:hover .pc-eq-bar { animation-duration: 0.55s; }

      /* body */
      .pc-body { position: relative; z-index: 5; padding: 16px 18px 18px; }
      .pc-avatar {
        position: relative; display: block; width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px;
      }
      .pc-avatar :where(img) { border-radius: 12px; object-fit: cover; width: 44px; height: 44px; }
      .pc-avatar-ring {
        position: absolute; inset: -3px; border-radius: 14px; pointer-events: none;
        background: conic-gradient(from 0deg, var(--accent), var(--accent-2), var(--accent));
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px;
        opacity: 0.8; animation: pcRingSpin 6s linear infinite;
      }
      .pc-onair {
        position: absolute; right: -3px; bottom: -3px; width: 11px; height: 11px; border-radius: 50%;
        background: #ff3b3b; border: 2px solid #0c0c0d;
        box-shadow: 0 0 0 0 rgba(255,59,59,0.6); animation: pcOnair 1.8s ease-out infinite;
      }
      .pc-name { color: var(--color-mag-white); text-decoration: none; transition: color 0.3s ease; display: block; }
      .pc-name:hover { color: color-mix(in oklab, var(--accent) 65%, white); }
      .pc-card:hover .pc-name { color: color-mix(in oklab, var(--accent) 55%, white); }
      .pc-tagline { color: color-mix(in oklab, var(--accent) 78%, white); }
      .pc-chip {
        border-radius: 9999px; padding: 0.24rem 0.62rem;
        border: 1px solid color-mix(in oklab, var(--accent) 22%, var(--color-mag-border));
        background: color-mix(in oklab, var(--accent) 7%, transparent);
        font-size: 0.66rem; font-weight: 600; color: color-mix(in oklab, var(--accent) 42%, var(--color-mag-light));
      }

      .pc-cta {
        display: inline-flex; align-items: center; gap: 0.45rem; text-decoration: none;
        border-radius: 9999px; padding: 0.5rem 0.9rem;
        font-size: 0.76rem; font-weight: 800; letter-spacing: 0.01em;
        color: #fff; background: #ff0000;
        box-shadow: 0 8px 22px -8px rgba(255,0,0,0.6);
        transition: transform 0.25s ease, box-shadow 0.3s ease, filter 0.3s ease;
      }
      .pc-cta:hover { transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 12px 28px -8px rgba(255,0,0,0.75); }
      .pc-cta-arrow { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); opacity: 0.85; }
      .pc-cta:hover .pc-cta-arrow { transform: translate(2px,-2px); }
      .pc-latest {
        display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: none;
        font-size: 0.72rem; font-weight: 700; letter-spacing: 0.02em;
        color: color-mix(in oklab, var(--accent) 78%, white);
        transition: color 0.3s ease;
      }
      .pc-latest:hover { color: color-mix(in oklab, var(--accent) 92%, white); }

      @keyframes pcShine { to { background-position: -220% center; } }
      @keyframes pcRingSpin { to { transform: rotate(360deg); } }
      @keyframes pcShineSweep { to { transform: translateX(160%) skewX(-16deg); } }
      @keyframes pcPulse { 0% { box-shadow: 0 0 0 0 rgba(255,59,59,0.55); } 70%,100% { box-shadow: 0 0 0 7px transparent; } }
      @keyframes pcOnair { 0% { box-shadow: 0 0 0 0 rgba(255,59,59,0.6); } 70%,100% { box-shadow: 0 0 0 6px transparent; } }
      @keyframes pcEq { 0%,100% { transform: scaleY(0.28); } 50% { transform: scaleY(1); } }
      @keyframes pcWave { 0%,100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }
      @keyframes pcRipple { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.9); opacity: 0; } }

      @media (prefers-reduced-motion: reduce) {
        .pc-title, .pc-wave-bar, .pc-ring, .pc-shine, .pc-eq-bar, .pc-avatar-ring,
        .pc-onair, .pc-eyebrow-dot, .pc-play-ripple { animation: none !important; }
        .pc-card:hover .pc-cover-img { transform: none !important; }
        .pc-title { background-position: 0 center; }
        .pc-eq-bar { transform: scaleY(0.6); }
      }
    `}</style>
  );
}
