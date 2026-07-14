"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, BookOpen, Headphones, ShoppingCart, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   The SPX6900 Library.

   Every book is rendered as a real 3D object — front cover, coloured spine,
   and a cream page-block — standing on a glowing shelf. The book turns toward
   the cursor (spring-smoothed), lifts and opens on hover, catches a specular
   sweep, and sits inside an accent-lit living border.

   Pointer position is measured against the OUTER, untransformed shell (never
   the tilting book), so the tilt can't feed back on its own projected rect and
   jitter. Card backgrounds are opaque (no stacked backdrop-blur) for smooth
   scrolling, and every animation is transform/opacity only + reduced-motion
   guarded.
   ──────────────────────────────────────────────────────────────────────── */

type Cta = { label: string; href: string; icon: "buy" | "read" | "listen" };

type Book = {
  id: string;
  title: string;
  author: string;
  blurb: string;
  cover: { src: string; alt: string };
  /** true → free to read; false → paid (Amazon). Drives the corner badge. */
  free: boolean;
  format: string;
  chips: string[];
  ctas: Cta[];
  accent: string;
  accent2: string;
  /** Dark spine colour. */
  spine: string;
  /** Short label printed down the spine. */
  spineText: string;
};

const BOOKS: Book[] = [
  {
    id: "stop-trading",
    title: "Stop Trading, Start Believing!",
    author: "Audacious",
    blurb:
      "A tokenized movement against TradFi: flipping the stock market one holder at a time.",
    cover: { src: "/books/stop-trading.jpg", alt: "SPX6900: Stop Trading, Start Believing! book cover" },
    free: false,
    format: "Paperback",
    chips: ["Paperback", "Manifesto"],
    ctas: [{ label: "Buy on Amazon", href: "https://www.amazon.com/dp/B0FC4BGVKJ", icon: "buy" }],
    accent: "#E6A93C",
    accent2: "#F7CE7A",
    spine: "#3C2708",
    spineText: "SPX6900",
  },
  {
    id: "belief-asset",
    title: "Discovering SPX6900",
    author: "Audacious",
    blurb:
      "The world's first pure belief asset: the rise of a token built on conviction, culture, and community.",
    cover: { src: "/books/belief-asset.png", alt: "Discovering SPX6900: The World's First Pure Belief Asset book cover" },
    free: true,
    format: "E-book + Audiobook",
    chips: ["Free e-book", "Audiobook", "PDF"],
    ctas: [
      { label: "Read free", href: "https://drive.google.com/file/d/1WgPw64bjTeSu0I9j4KtvAgy1r7XhK0wq/view", icon: "read" },
      { label: "Listen", href: "https://drive.google.com/file/d/1r_qapOhGi1keSwnuyt7lAF3Fh66B9GpH/view", icon: "listen" },
    ],
    accent: "#F0C24B",
    accent2: "#FBE08C",
    spine: "#4A3208",
    spineText: "BELIEF ASSET",
  },
  {
    id: "invest-grow-rich",
    title: "Invest & Grow Rich",
    author: "Jordan Riz",
    blurb:
      "A movement-coin investing playbook: how to thrive in the AI age with the ticker that flips the S&P.",
    cover: { src: "/books/invest-grow-rich.jpg", alt: "SPX6900: Invest & Grow Rich book cover" },
    free: false,
    format: "Paperback",
    chips: ["Paperback", "AI age"],
    ctas: [{ label: "Buy on Amazon", href: "https://www.amazon.com/dp/B0FXTRKLLT", icon: "buy" }],
    accent: "#CBA24A",
    accent2: "#EACF87",
    spine: "#211E17",
    spineText: "INVEST",
  },
  {
    id: "alchemical",
    title: "Alchemical",
    author: "RLanky",
    blurb:
      "A crystalline meditation on transformation: the community's most esoteric title, wrapped in glass.",
    cover: { src: "/books/alchemical.png", alt: "Alchemical book cover" },
    free: true,
    format: "E-book",
    chips: ["Free e-book", "Esoteric"],
    ctas: [{ label: "Read free", href: "https://docs.google.com/document/d/1ZQV3oFbK3BbK1__5K6MblfLxzr3m0z3u/edit", icon: "read" }],
    accent: "#AAC4E0",
    accent2: "#E6EEF7",
    spine: "#5E6B7A",
    spineText: "ALCHEMICAL",
  },
];

/* Rising gold dust behind the hero. Deterministic for SSR parity. */
const DUST = [
  { l: 8, d: 0, dur: 11, s: 3 },
  { l: 19, d: 3.1, dur: 13, s: 2 },
  { l: 30, d: 6, dur: 9.5, s: 4 },
  { l: 42, d: 1.6, dur: 12.5, s: 2 },
  { l: 53, d: 4.4, dur: 10.5, s: 3 },
  { l: 63, d: 2.2, dur: 14, s: 2 },
  { l: 72, d: 5.6, dur: 9, s: 3 },
  { l: 82, d: 0.8, dur: 12, s: 2 },
  { l: 90, d: 3.6, dur: 13.5, s: 4 },
  { l: 96, d: 6.6, dur: 10, s: 2 },
];

const CTA_ICON = { buy: ShoppingCart, read: BookOpen, listen: Headphones } as const;

export default function BookShowcase() {
  return (
    <section className="bk-page relative mx-auto w-full max-w-6xl px-4 pb-28 pt-14 sm:pt-20">
      <BookHero />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-2 lg:gap-7">
        {BOOKS.map((book, i) => (
          <BookCard key={book.id} book={book} order={i} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-16 max-w-xl text-center text-sm leading-relaxed text-mag-muted"
      >
        The gospel of the pure belief asset, written by the community. Buy the paperbacks,
        download the e-books, press play on the audiobook: then go tell someone.
      </motion.p>

      <BookStyles />
    </section>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */

function BookHero() {
  return (
    <header className="relative text-center">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 overflow-hidden">
        {DUST.map((m, i) => (
          <span
            key={i}
            className="bk-dust absolute"
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

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex justify-center"
      >
        <span className="bk-eyebrow-chip">
          <Sparkles className="h-3.5 w-3.5" />
          The Cognisphere Library
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="bk-title relative z-10 mt-6 font-display text-[2.7rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]"
      >
        The SPX6900 Library
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto mt-5 max-w-xl text-base leading-relaxed text-mag-muted sm:text-lg"
      >
        The essential reading on the pure belief asset: Amazon paperbacks, free e-books, and
        an audiobook, all written by Aeons. Read, believe, repeat.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2.5"
      >
        {["4 books", "2 free", "2 on Amazon", "1 audiobook"].map((s) => (
          <span key={s} className="bk-stat">
            {s}
          </span>
        ))}
      </motion.div>
    </header>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function BookCard({ book, order }: { book: Book; order: number }) {
  const reduce = useReducedMotion();
  // Ref lives on the OUTER, untransformed shell — never on the tilting book.
  const shellRef = useRef<HTMLElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 130, damping: 15, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 130, damping: 15, mass: 0.4 });
  // The book rests turned ~24° to show its spine; the cursor nudges it a little
  // more open (toward the reader) or further closed, plus a gentle pitch.
  const rotateY = useTransform(sx, [0, 1], [-34, -6]);
  const rotateX = useTransform(sy, [0, 1], [10, -6]);

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
      transition={{ duration: 0.7, delay: (order % 2) * 0.08 + 0.04, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="bk-shell"
      style={{ ["--accent" as string]: book.accent, ["--accent-2" as string]: book.accent2, ["--spine" as string]: book.spine }}
    >
      <div className="bk-card group/bk">
        <span aria-hidden className="bk-ring" />

        <div className="bk-grid">
          {/* ── 3D book stage ── */}
          <div className="bk-stage">
            <motion.div
              className="bk-tilt"
              style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: "preserve-3d" }}
            >
              <div className="bk-book">
                <span className="bk-face bk-back" />
                <span className="bk-face bk-spine">
                  <span className="bk-spine-text">{book.spineText}</span>
                </span>
                <span className="bk-face bk-top" />
                <span className="bk-face bk-fore" />
                <span className="bk-face bk-front">
                  <Image
                    src={book.cover.src}
                    alt={book.cover.alt}
                    fill
                    sizes="200px"
                    className="bk-cover-img object-cover"
                  />
                  <span aria-hidden className="bk-gutter" />
                  <span aria-hidden className="bk-sheen" />
                </span>
              </div>
            </motion.div>
            <span aria-hidden className="bk-plinth" />
            <span
              className={`bk-badge ${book.free ? "is-free" : "is-paid"}`}
            >
              {book.free ? "Free" : "Amazon"}
            </span>
          </div>

          {/* ── Info ── */}
          <div className="bk-info">
            <span className="bk-format">{book.format}</span>
            <h2 className="bk-name font-display text-xl font-bold leading-tight tracking-tight sm:text-2xl">
              {book.title}
            </h2>
            <p className="bk-author">by {book.author}</p>
            <p className="bk-blurb">{book.blurb}</p>

            <div className="bk-chips">
              {book.chips.map((c) => (
                <span key={c} className="bk-chip">
                  {c}
                </span>
              ))}
            </div>

            <div className="bk-ctas">
              {book.ctas.map((cta, i) => {
                const Icon = CTA_ICON[cta.icon];
                return (
                  <a
                    key={cta.href}
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bk-cta ${i === 0 ? "is-primary" : "is-secondary"}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{cta.label}</span>
                    <ArrowUpRight className="bk-cta-arrow h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Scoped styles (themed per-book via var(--accent)/--spine) ─────────── */

function BookStyles() {
  return (
    <style>{`
      .bk-page { isolation: isolate; }

      /* hero */
      .bk-eyebrow-chip {
        display: inline-flex; align-items: center; gap: 0.5rem;
        border-radius: 9999px; padding: 0.4rem 0.95rem;
        border: 1px solid color-mix(in oklab, var(--color-gold-400) 38%, transparent);
        background: color-mix(in oklab, var(--color-gold-400) 8%, transparent);
        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--color-gold-300);
      }
      .bk-eyebrow-chip svg { color: var(--color-gold-400); }
      .bk-title {
        background: linear-gradient(94deg, var(--color-gold-200) 0%, var(--color-mag-white) 26%, var(--color-gold-300) 50%, var(--color-mag-white) 74%, var(--color-gold-200) 100%);
        background-size: 220% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        text-shadow: 0 2px 50px color-mix(in oklab, var(--color-gold-400) 20%, transparent);
        animation: bkShine 6s linear infinite;
      }
      .bk-stat {
        border-radius: 9999px; padding: 0.34rem 0.85rem;
        border: 1px solid var(--color-mag-border);
        background: color-mix(in oklab, var(--color-mag-white) 4%, transparent);
        font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; color: var(--color-mag-light);
      }
      .bk-dust {
        bottom: 0; border-radius: 50%;
        background: var(--color-gold-300);
        box-shadow: 0 0 8px color-mix(in oklab, var(--color-gold-300) 85%, transparent);
        opacity: 0; will-change: transform, opacity;
        animation-name: bkDust; animation-timing-function: ease-in-out; animation-iteration-count: infinite;
      }

      /* card shell / frame */
      .bk-shell { transform-style: preserve-3d; }
      .bk-card {
        position: relative; overflow: hidden; border-radius: 24px;
        border: 1px solid color-mix(in oklab, var(--accent) 22%, var(--color-mag-border));
        background:
          radial-gradient(120% 90% at 12% -10%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 55%),
          linear-gradient(165deg, #14110b 0%, #0b0a09 60%);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-mag-white) 7%, transparent) inset,
                    0 20px 50px -30px rgba(0,0,0,0.9);
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.4s ease;
      }
      .bk-card:hover {
        transform: translateY(-4px);
        border-color: color-mix(in oklab, var(--accent) 55%, transparent);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-mag-white) 12%, transparent) inset,
                    0 34px 66px -34px color-mix(in oklab, var(--accent) 55%, black),
                    0 0 46px -10px color-mix(in oklab, var(--accent) 40%, transparent);
      }
      .bk-ring {
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
      .bk-card:hover .bk-ring { opacity: 1; animation: bkRing 4.5s linear infinite; }

      .bk-grid {
        position: relative; z-index: 3;
        display: grid; grid-template-columns: 1fr; gap: 8px;
        padding: 22px 22px 24px; align-items: center; justify-items: center; text-align: center;
      }
      @media (min-width: 480px) {
        .bk-grid { grid-template-columns: auto 1fr; gap: 22px; justify-items: start; text-align: left; }
      }

      /* ── 3D book ── */
      .bk-stage {
        --bw: 150px; --bh: 216px; --bd: 30px;
        position: relative; width: var(--bw); height: calc(var(--bh) + 26px);
        perspective: 1100px; perspective-origin: 50% 40%;
        display: flex; align-items: flex-start; justify-content: center;
        margin-top: 4px;
      }
      @media (min-width: 480px) { .bk-stage { --bw: 164px; --bh: 236px; --bd: 32px; } }

      .bk-tilt { width: var(--bw); height: var(--bh); transform-style: preserve-3d; will-change: transform; }
      .bk-book {
        position: relative; width: var(--bw); height: var(--bh); transform-style: preserve-3d;
        transform: rotateY(-26deg) rotateX(6deg);
        transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        will-change: transform;
      }
      .bk-card:hover .bk-book { transform: rotateY(-14deg) rotateX(3deg) translateY(-10px) scale(1.04); }

      .bk-face { position: absolute; top: 0; left: 0; }
      .bk-front {
        width: var(--bw); height: var(--bh); overflow: hidden;
        border-radius: 3px 6px 6px 3px;
        transform: translateZ(calc(var(--bd) / 2));
        box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 18px 30px -14px rgba(0,0,0,0.8);
        background: #0a0a0b;
      }
      .bk-cover-img { border-radius: 3px 6px 6px 3px; }
      .bk-gutter {
        position: absolute; inset: 0 auto 0 0; width: 16px; pointer-events: none;
        background: linear-gradient(90deg, rgba(0,0,0,0.45), transparent);
      }
      .bk-sheen {
        position: absolute; inset: 0; pointer-events: none; border-radius: 3px 6px 6px 3px;
        background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.32) 50%, transparent 65%);
        transform: translateX(-140%); opacity: 0.9;
      }
      .bk-card:hover .bk-sheen { animation: bkSheen 1s cubic-bezier(0.4,0,0.2,1) 0.05s forwards; }

      .bk-back {
        width: var(--bw); height: var(--bh); border-radius: 3px 6px 6px 3px;
        transform: translateZ(calc(var(--bd) / -2)) rotateY(180deg);
        background: linear-gradient(155deg, color-mix(in oklab, var(--spine) 70%, #0a0a0a), #0a0a0a);
      }
      .bk-spine {
        width: var(--bd); height: var(--bh); left: 0;
        transform: translateX(calc(var(--bd) / -2)) rotateY(-90deg);
        background: linear-gradient(90deg,
          color-mix(in oklab, var(--spine) 55%, #000) 0%,
          var(--spine) 42%,
          color-mix(in oklab, var(--accent) 30%, var(--spine)) 100%);
        border-radius: 3px 0 0 3px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: inset -3px 0 8px rgba(0,0,0,0.5), inset 2px 0 3px rgba(255,255,255,0.08);
      }
      .bk-spine-text {
        writing-mode: vertical-rl; transform: rotate(180deg);
        font-family: var(--font-display); font-size: 0.5rem; font-weight: 800;
        letter-spacing: 0.14em; text-transform: uppercase;
        color: color-mix(in oklab, var(--accent-2) 85%, white);
        white-space: nowrap; opacity: 0.9;
      }
      .bk-fore {
        width: var(--bd); height: var(--bh); left: 0;
        transform: translateX(calc(var(--bw) - var(--bd) / 2)) rotateY(90deg);
        background: repeating-linear-gradient(90deg, #efe9db 0 1.5px, #d7cfbc 1.5px 3px);
        border-radius: 0 3px 3px 0;
      }
      .bk-top {
        width: var(--bw); height: var(--bd); top: 0;
        transform: translateY(calc(var(--bd) / -2)) rotateX(90deg);
        background: repeating-linear-gradient(90deg, #f3eede 0 2px, #ded6c4 2px 4px);
      }

      /* shelf plinth + contact shadow */
      .bk-plinth {
        position: absolute; left: 50%; bottom: 6px; width: 118%; height: 30px;
        transform: translateX(-50%);
        background: radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.62), transparent 72%);
        filter: blur(3px); z-index: -1;
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .bk-card:hover .bk-plinth { transform: translateX(-50%) scale(0.9); opacity: 0.75; }

      .bk-badge {
        position: absolute; top: -2px; right: -2px; z-index: 6;
        display: inline-flex; align-items: center;
        border-radius: 9999px; padding: 0.22rem 0.6rem;
        font-size: 0.58rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
        box-shadow: 0 4px 12px -3px rgba(0,0,0,0.5);
      }
      .bk-badge.is-free { color: #06281c; background: linear-gradient(135deg, #6ff2b6, #24c980); }
      .bk-badge.is-paid {
        color: #23180a;
        background: linear-gradient(135deg, var(--color-gold-200), var(--color-gold-400));
      }

      /* info column */
      .bk-format {
        display: inline-block; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
        color: color-mix(in oklab, var(--accent) 55%, var(--color-mag-muted));
      }
      .bk-name { margin-top: 0.35rem; color: var(--color-mag-white); transition: color 0.3s ease; }
      .bk-card:hover .bk-name { color: color-mix(in oklab, var(--accent) 62%, white); }
      .bk-author { margin-top: 0.25rem; font-size: 0.8rem; font-style: italic; color: color-mix(in oklab, var(--accent) 70%, white); }
      .bk-blurb { margin-top: 0.7rem; font-size: 0.86rem; line-height: 1.55; color: var(--color-mag-muted); }
      .bk-chips { margin-top: 0.9rem; display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; }
      @media (min-width: 480px) { .bk-chips { justify-content: flex-start; } }
      .bk-chip {
        border-radius: 9999px; padding: 0.24rem 0.62rem;
        border: 1px solid color-mix(in oklab, var(--accent) 22%, var(--color-mag-border));
        background: color-mix(in oklab, var(--accent) 7%, transparent);
        font-size: 0.66rem; font-weight: 600; color: color-mix(in oklab, var(--accent) 42%, var(--color-mag-light));
      }
      .bk-ctas { margin-top: 1.1rem; display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; }
      @media (min-width: 480px) { .bk-ctas { justify-content: flex-start; } }
      .bk-cta {
        display: inline-flex; align-items: center; gap: 0.45rem;
        border-radius: 9999px; padding: 0.5rem 0.95rem;
        font-size: 0.76rem; font-weight: 800; letter-spacing: 0.02em; text-decoration: none;
        transition: transform 0.25s ease, box-shadow 0.3s ease, background 0.3s ease;
      }
      .bk-cta.is-primary {
        color: #14100a;
        background: linear-gradient(135deg, var(--accent-2), var(--accent));
        box-shadow: 0 8px 22px -8px color-mix(in oklab, var(--accent) 75%, transparent);
      }
      .bk-cta.is-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -8px color-mix(in oklab, var(--accent) 85%, transparent); }
      .bk-cta.is-secondary {
        color: color-mix(in oklab, var(--accent) 80%, white);
        border: 1px solid color-mix(in oklab, var(--accent) 42%, transparent);
        background: color-mix(in oklab, var(--accent) 8%, transparent);
      }
      .bk-cta.is-secondary:hover { transform: translateY(-2px); background: color-mix(in oklab, var(--accent) 15%, transparent); }
      .bk-cta-arrow { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); opacity: 0.8; }
      .bk-cta:hover .bk-cta-arrow { transform: translate(2px,-2px); }

      @keyframes bkShine { to { background-position: -220% center; } }
      @keyframes bkRing { to { transform: rotate(360deg); } }
      @keyframes bkSheen { to { transform: translateX(160%); } }
      @keyframes bkDust {
        0% { transform: translateY(0) scale(0.6); opacity: 0; }
        12% { opacity: 0.9; }
        85% { opacity: 0.5; }
        100% { transform: translateY(-320px) scale(1); opacity: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .bk-title, .bk-dust, .bk-ring, .bk-sheen { animation: none !important; }
        .bk-card:hover .bk-book { transform: rotateY(-26deg) rotateX(6deg) !important; }
        .bk-title { background-position: 0 center; }
        .bk-dust { display: none; }
      }
    `}</style>
  );
}
