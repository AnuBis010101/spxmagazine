"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Lock, Users } from "lucide-react";
import AeonColophon from "@/components/aeon/AeonColophon";

/* ─────────────────────────────────────────────────────────────────────────
   The SPX6900 storefront directory.

   A gallery of the community's stores rendered as ultra-premium, cursor-tilting
   "trading-card" panels: real storefront key-art in a framed preview stage, a
   floating product polaroid, an accent-lit living border, a specular sweep on
   hover, and a coming-soon lockup for any store that hasn't opened yet.

   Every effect is transform/opacity only and gated behind prefers-reduced-motion.
   Card backgrounds are opaque gradients (no stacked backdrop-blur) so the page
   stays buttery on scroll — only the small coming-soon lock uses a blur.
   ──────────────────────────────────────────────────────────────────────── */

type BrandMark =
  | { kind: "logo"; src: string; alt: string; h: number; pill: "light" | "dark" }
  | { kind: "avatar"; src: string; alt: string }
  | { kind: "text"; text: string };

type Store = {
  id: string;
  /** Official SPX6900 merch store, or a community-run storefront. */
  kind: "official" | "community";
  name: string;
  /** Small line above the CTA / under the preview. */
  tagline: string;
  blurb: string;
  href: string;
  /** Accent hue that lights the whole card. */
  accent: string;
  accent2: string;
  /** Big framed key-art. */
  hero: { src: string; alt: string; position?: string; tone: "light" | "dark" };
  /** Optional floating product polaroid. */
  product?: { src: string; alt: string; pad?: boolean };
  /** Brand lockup shown as a badge over the preview. */
  mark: BrandMark;
  meta: string[];
  status: "live" | "soon";
  cta: string;
};

const STORES: Store[] = [
  {
    id: "industries",
    kind: "official",
    name: "SPX6900 Industries",
    tagline: "Advanced merch for the savvy Aeon",
    blurb:
      "Editorial-grade apparel and SPX art. Step into the Cognisphere in style and decorate your space with the movement.",
    href: "https://spx6900industries.com/",
    accent: "#2FE6A6",
    accent2: "#8BFFD8",
    hero: {
      src: "/stores/industries-hero-tall.png",
      alt: "SPX6900 Industries: Aeon angel key art",
      position: "center 18%",
      tone: "light",
    },
    product: { src: "/stores/industries-tee.png", alt: "SPX6900 Industries washed tee", pad: true },
    mark: { kind: "logo", src: "/stores/industries-logo.png", alt: "SPX6900 Industries", h: 22, pill: "light" },
    meta: ["Shopify", "Apparel + Art", "Ships worldwide"],
    status: "live",
    cta: "Visit store",
  },
  {
    id: "gear",
    kind: "community",
    name: "SPX6900 Gear",
    tagline: "We will flip the stock market",
    blurb:
      "Hoodies, tees, mugs, hats, cards & more: mostly unisex, in every color and size. Suit up and join the movement.",
    href: "https://spx6900gear.com/",
    accent: "#39FF14",
    accent2: "#B8FF5A",
    hero: {
      src: "/stores/gear-tee.jpg",
      alt: "SPX6900 Gear classic tee",
      position: "center",
      tone: "light",
    },
    product: { src: "/stores/gear-hoodie.jpg", alt: "SPX6900 Gear premium hoodie" },
    mark: { kind: "logo", src: "/stores/gear-logo.png", alt: "SPX6900 Gear", h: 30, pill: "dark" },
    meta: ["Shopify", "Hoodies · Tees · Hats", "Unisex fits"],
    status: "live",
    cta: "Visit store",
  },
  {
    id: "jinpinglabs",
    kind: "community",
    name: "Jinping Labs",
    tagline: "The lab has opened its doors",
    blurb:
      "Tokyo-coded SPX6900 streetwear: Auto Heal tees, the 3333 windbreaker, jerseys, caps and glassware, all shot as one lookbook.",
    href: "https://jinpinglabs.com/",
    accent: "#FFC93C",
    accent2: "#FFE79A",
    hero: {
      src: "/stores/jinping-hero.jpg",
      alt: "Jinping Labs lookbook: three models in SPX6900 tees",
      // Portrait source in a 16:9 frame — bias upward to keep the garments in shot.
      position: "center 22%",
      tone: "dark",
    },
    product: { src: "/stores/jinping-jacket.png", alt: "Jinping Labs 3333 Cute Girls windbreaker" },
    mark: { kind: "avatar", src: "/stores/jinping-logo.jpg", alt: "Jinping Labs" },
    meta: ["Shopify", "Apparel · Hats · Glassware", "Collection One"],
    status: "live",
    cta: "Visit store",
  },
];

/* Drifting coins behind the hero. Deterministic for SSR parity. */
const COINS = [
  { l: 6, t: 14, s: 46, d: 0, dur: 15, r: -12 },
  { l: 88, t: 22, s: 34, d: 2.4, dur: 18, r: 16 },
  { l: 16, t: 74, s: 28, d: 4.1, dur: 13, r: 8 },
  { l: 80, t: 68, s: 40, d: 1.2, dur: 20, r: -18 },
  { l: 50, t: 8, s: 24, d: 3.3, dur: 16, r: 10 },
];

export default function StoreShowcase() {
  // The cover plate goes to the official store, read from the data rather than
  // from array position. A fourth storefront would land in the contents column
  // automatically — but this composition is authored for 1 + 2, so treat a
  // fourth as a reason to re-derive the arrangement, not to append to it.
  const flagship = STORES.find((s) => s.kind === "official") ?? STORES[0];
  const community = STORES.filter((s) => s !== flagship);

  return (
    <section className="sc-page relative mx-auto w-full max-w-6xl px-4 pb-28 pt-14 sm:pt-20">
      <StoreHero />

      {/* Cover + contents. Three cards in the old 2-col grid left a hole
          exactly one card wide, and emptiness that is card-shaped reads as an
          omission rather than as margin. So the flagship takes a full-height
          portrait plate in the 7fr track and the two community stores stack in
          the 5fr track beside it. The right column's natural height drives the
          row and the plate's key art absorbs the slack (see .sc-gallery in
          StoreStyles), so both columns end on the same pixel at every width.

          The 1 + 2 split is read from the data, not from array position, so
          the official store keeps the plate however STORES is ordered.

          One column below lg on purpose: with three cards a 2-col tablet state
          would just re-introduce the orphan this exists to delete. */}
      <div className="sc-gallery mt-14 grid grid-cols-1 items-stretch gap-6 sm:mt-16 lg:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-7">
        <StoreCard store={flagship} order={0} />

        <div className="flex flex-col gap-6 lg:gap-7">
          {community.map((store, i) => (
            <StoreCard key={store.id} store={store} order={i + 1} />
          ))}
        </div>
      </div>

      <AeonColophon id={9} />

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-mag-muted"
      >
        <span className="text-mag-light">SPX6900 Industries</span> is the official merch store: the
        rest are built by the community. Every thread, sticker, and artifact flies the same flag.
      </motion.p>

      <StoreStyles />
    </section>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */

function StoreHero() {
  return (
    <header className="relative text-center">
      {/* drifting coins */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 bottom-0 overflow-hidden">
        {COINS.map((c, i) => (
          <img
            key={i}
            src="/spx6900-coin.png"
            alt=""
            className="sc-coin absolute"
            style={{
              left: `${c.l}%`,
              top: `${c.t}%`,
              width: c.s,
              height: c.s,
              animationDelay: `${c.d}s`,
              animationDuration: `${c.dur}s`,
              ["--r" as string]: `${c.r}deg`,
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
        <span className="sc-eyebrow">
          <span className="sc-eyebrow-dot" />
          The Cognisphere Marketplace
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="sc-title relative z-10 mt-6 font-display text-[2.7rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]"
      >
        The SPX6900 Store
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto mt-5 max-w-xl text-base leading-relaxed text-mag-muted sm:text-lg"
      >
        One official store and two community storefronts. Pick yours and gear up
        for the flippening.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2.5"
      >
        {[
          { label: "1 official", tone: "gold" as const },
          { label: "2 community", tone: "plain" as const },
          { label: "All live", tone: "plain" as const },
        ].map((s) => (
          <span key={s.label} className={`sc-stat ${s.tone === "gold" ? "is-gold" : ""}`}>
            {s.tone === "gold" && <BadgeCheck className="h-3.5 w-3.5" />}
            {s.label}
          </span>
        ))}
      </motion.div>
    </header>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function StoreCard({ store, order }: { store: Store; order: number }) {
  const reduce = useReducedMotion();
  // Ref lives on the OUTER, untransformed shell — never on the tilting card.
  // Measuring getBoundingClientRect() off the rotating element returns its
  // 3D-projected box (which shifts/resizes as it tilts), so each move would
  // remap the pointer and make the tilt jitter. The shell only carries
  // `perspective` (applied to children, not itself), so its box is stable.
  const shellRef = useRef<HTMLElement>(null);

  // Pointer position 0..1 across the card, spring-smoothed → tilt + glare.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 16, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 140, damping: 16, mass: 0.4 });
  const TILT = 6.5;
  const rotateY = useTransform(sx, [0, 1], [-TILT, TILT]);
  const rotateX = useTransform(sy, [0, 1], [TILT, -TILT]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(300px circle at ${glareX} ${glareY}, rgba(255,255,255,0.14), transparent 60%)`;

  const soon = store.status === "soon";
  const official = store.kind === "official";

  function onMove(e: React.PointerEvent) {
    if (reduce) return;
    const el = shellRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Clamp so a raised (translateZ) child that overhangs the shell edge can't
    // push the value past [0,1] and snap the tilt.
    const nx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    px.set(nx);
    py.set(ny);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (order % 2) * 0.08 + 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="sc-card-shell"
      ref={shellRef}
    >
      <motion.a
        href={store.href}
        target="_blank"
        rel="noopener noreferrer"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          perspective: 1300,
          ["--accent" as string]: store.accent,
          ["--accent-2" as string]: store.accent2,
        }}
        className={`sc-card group/card ${official ? "is-official" : ""}`}
        aria-label={`${store.name}: ${official ? "official SPX6900 store" : "community store"}, ${soon ? "coming soon" : "open in a new tab"}`}
      >
        {/* living accent border — stays on the stable frame, never tilts */}
        <span aria-hidden className="sc-ring" />

        {/* Tilt layer: the ONLY element that rotates. Because :hover, the ring,
            and overflow:hidden all live on the stable frame above, the tilt can
            never swing the card's own hit-area past the cursor — so :hover (and
            the ring/shine animations it drives) can't flicker on mouse move. */}
        <motion.div
          className="sc-card-tilt"
          style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: "preserve-3d" }}
        >
        {/* ─ Preview stage ─ */}
        <div className="sc-stage" style={{ transform: "translateZ(1px)" }}>
          <div className={`sc-stage-img ${store.hero.tone === "light" ? "is-light" : ""}`}>
            <Image
              src={store.hero.src}
              alt={store.hero.alt}
              fill
              // min-width-first so it agrees with the layout's own lg
              // breakpoint (the old max-width:1024px and Tailwind's lg: both
              // matched at exactly 1024px). Below lg the stage is the viewport
              // less the page padding, the card border and the stage margins.
              sizes="(min-width: 1024px) 620px, calc(100vw - 54px)"
              className="sc-hero-img object-cover"
              style={{ objectPosition: store.hero.position ?? "center" }}
            />
          </div>

          {/* scrims: darken edges + fade into body */}
          <span aria-hidden className="sc-stage-scrim" />
          <span aria-hidden className="sc-stage-vignette" />
          {/* specular sweep on hover */}
          <span aria-hidden className="sc-shine" />
          {/* animated glare tracking the cursor */}
          {!reduce && <motion.span aria-hidden className="sc-glare" style={{ backgroundImage: glare }} />}

          {/* official / community classifier + live status */}
          <span
            className={`sc-kind ${official ? "is-official" : "is-community"}`}
            style={{ transform: "translateZ(46px)" }}
          >
            {official ? <BadgeCheck className="h-3.5 w-3.5" /> : <Users className="h-3 w-3" />}
            {official ? "Official" : "Community"}
            {official && <span aria-hidden className="sc-kind-shine" />}
          </span>
          <span
            className={`sc-status ${soon ? "is-soon" : "is-live"}`}
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="sc-status-dot" />
            {soon ? "Coming soon" : "Live now"}
          </span>

          {/* brand mark badge */}
          <span className="sc-mark" style={{ transform: "translateZ(46px)" }}>
            <BrandMarkView mark={store.mark} />
          </span>

          {/* floating product polaroid */}
          {store.product && (
            <span
              aria-hidden
              className="sc-poly"
              style={{ transform: "translateZ(60px)" }}
            >
              <span className="sc-poly-inner">
                <Image
                  src={store.product.src}
                  alt=""
                  fill
                  sizes="120px"
                  className={store.product.pad ? "object-contain p-1.5" : "object-cover"}
                />
              </span>
            </span>
          )}

          {/* coming-soon lock overlay */}
          {soon && (
            <span aria-hidden className="sc-lock">
              <span className="sc-radar" />
              <span className="sc-lock-badge">
                <Lock className="h-3.5 w-3.5" />
                Booting soon
              </span>
            </span>
          )}
        </div>

        {/* ─ Body ─ */}
        <div className="sc-body" style={{ transform: "translateZ(24px)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={`sc-kind-eyebrow ${official ? "is-official" : "is-community"}`}>
                {official ? "Official merch store" : "Community store"}
              </span>
              <h2 className="sc-name mt-1 flex items-center gap-1.5 font-display text-xl font-bold tracking-tight sm:text-2xl">
                <span className="truncate">{store.name}</span>
                {official && (
                  <BadgeCheck className="sc-verified h-[1.05rem] w-[1.05rem] shrink-0" aria-label="Official store" />
                )}
              </h2>
              <p className="sc-tagline mt-1 text-sm font-medium italic">{store.tagline}</p>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-mag-muted">{store.blurb}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {store.meta.map((m) => (
              <span key={m} className="sc-chip">
                {m}
              </span>
            ))}
          </div>

          <span className={`sc-cta ${soon ? "is-soon" : ""}`}>
            {soon ? <Lock className="h-4 w-4" /> : null}
            <span>{store.cta}</span>
            <ArrowUpRight className="sc-cta-arrow h-4 w-4" />
          </span>
        </div>
        </motion.div>
      </motion.a>
    </motion.article>
  );
}

function BrandMarkView({ mark }: { mark: BrandMark }) {
  if (mark.kind === "logo") {
    return (
      <span className={`sc-mark-pill ${mark.pill === "light" ? "is-light" : "is-dark"}`}>
        <Image src={mark.src} alt={mark.alt} width={mark.h * 5} height={mark.h} className="sc-mark-logo" style={{ height: mark.h, width: "auto" }} />
      </span>
    );
  }
  if (mark.kind === "avatar") {
    return (
      <span className="sc-mark-avatar">
        <Image src={mark.src} alt={mark.alt} width={40} height={40} />
      </span>
    );
  }
  return <span className="sc-mark-pill is-dark sc-mark-text">{mark.text}</span>;
}

/* ── Scoped styles (themed per-card via var(--accent)) ─────────────────── */

function StoreStyles() {
  return (
    <style>{`
      .sc-page { isolation: isolate; }

      /* hero */
      .sc-eyebrow {
        display: inline-flex; align-items: center; gap: 0.55rem;
        border-radius: 9999px; padding: 0.4rem 0.95rem;
        border: 1px solid color-mix(in oklab, var(--color-gold-400) 38%, transparent);
        background: color-mix(in oklab, var(--color-gold-400) 8%, transparent);
        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--color-gold-300);
      }
      .sc-eyebrow-dot {
        width: 6px; height: 6px; border-radius: 50%; background: var(--color-gold-400);
        box-shadow: 0 0 10px var(--color-gold-400);
        animation: scPulse 2.4s ease-out infinite;
      }
      .sc-title {
        background: linear-gradient(94deg, var(--color-gold-200) 0%, var(--color-mag-white) 26%, var(--color-gold-300) 50%, var(--color-mag-white) 74%, var(--color-gold-200) 100%);
        background-size: 220% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        text-shadow: 0 2px 50px color-mix(in oklab, var(--color-gold-400) 20%, transparent);
        animation: scTitleShine 6s linear infinite;
      }
      .sc-stat {
        display: inline-flex; align-items: center; gap: 0.35rem;
        border-radius: 9999px; padding: 0.34rem 0.85rem;
        border: 1px solid var(--color-mag-border);
        background: color-mix(in oklab, var(--color-mag-white) 4%, transparent);
        font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; color: var(--color-mag-light);
      }
      .sc-stat.is-gold {
        border-color: color-mix(in oklab, var(--color-gold-400) 55%, transparent);
        background: color-mix(in oklab, var(--color-gold-400) 12%, transparent);
        color: var(--color-gold-200);
      }
      .sc-stat.is-gold svg { color: var(--color-gold-300); }
      .sc-coin {
        opacity: 0.5; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.5));
        animation-name: scCoin; animation-timing-function: ease-in-out; animation-iteration-count: infinite;
        will-change: transform;
      }

      /* card shell / body */
      .sc-card-shell { transform-style: preserve-3d; }
      .sc-card {
        position: relative; display: block; overflow: hidden;
        border-radius: 26px;
        border: 1px solid color-mix(in oklab, var(--accent) 20%, var(--color-mag-border));
        background:
          radial-gradient(120% 80% at 50% -20%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 60%),
          linear-gradient(180deg, color-mix(in oklab, var(--accent) 6%, #101012), #0a0a0b 62%);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-mag-white) 8%, transparent) inset,
                    0 20px 50px -30px rgba(0,0,0,0.9);
        transition: transform 0.2s ease, box-shadow 0.4s ease, border-color 0.4s ease;
        text-decoration: none; color: inherit;
        will-change: transform;
      }
      .sc-card:hover {
        border-color: color-mix(in oklab, var(--accent) 55%, transparent);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-mag-white) 12%, transparent) inset,
                    0 30px 70px -34px color-mix(in oklab, var(--accent) 60%, black),
                    0 0 46px -8px color-mix(in oklab, var(--accent) 45%, transparent);
      }
      .sc-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

      /* Inner tilt layer — carries the 3D cursor parallax so the frame's :hover
         hit-area stays perfectly still (no hover flicker). */
      .sc-card-tilt { position: relative; transform-style: preserve-3d; will-change: transform; }

      /* flagship: the official store gets a gold-lit frame layered over its mint accent */
      .sc-card.is-official {
        border-color: color-mix(in oklab, var(--color-gold-400) 42%, var(--color-mag-border));
        background:
          radial-gradient(120% 80% at 50% -20%, color-mix(in oklab, var(--color-gold-400) 12%, transparent), transparent 58%),
          radial-gradient(120% 80% at 50% -20%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 60%),
          linear-gradient(180deg, color-mix(in oklab, var(--color-gold-400) 5%, #111011), #0a0a0b 62%);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-gold-100) 14%, transparent) inset,
                    0 22px 54px -30px rgba(0,0,0,0.9),
                    0 0 34px -12px color-mix(in oklab, var(--color-gold-400) 45%, transparent);
      }
      .sc-card.is-official:hover {
        border-color: color-mix(in oklab, var(--color-gold-400) 70%, transparent);
        box-shadow: 0 1px 0 color-mix(in oklab, var(--color-gold-100) 20%, transparent) inset,
                    0 30px 72px -34px color-mix(in oklab, var(--color-gold-500) 55%, black),
                    0 0 50px -8px color-mix(in oklab, var(--color-gold-400) 55%, transparent);
      }
      /* gold living ring for the flagship (overrides the accent ring hue) */
      .sc-card.is-official .sc-ring {
        background: conic-gradient(from 0deg,
          transparent 0deg,
          color-mix(in oklab, var(--color-gold-400) 90%, transparent) 60deg,
          color-mix(in oklab, var(--color-gold-200) 95%, transparent) 110deg,
          transparent 180deg,
          transparent 360deg);
      }

      /* living accent ring (masked 1px conic border, animates on hover) */
      .sc-ring {
        position: absolute; inset: 0; border-radius: 26px; padding: 1px; z-index: 4;
        pointer-events: none; opacity: 0;
        background: conic-gradient(from 0deg,
          transparent 0deg,
          color-mix(in oklab, var(--accent) 85%, transparent) 60deg,
          color-mix(in oklab, var(--accent-2) 95%, transparent) 110deg,
          transparent 180deg,
          transparent 360deg);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        transition: opacity 0.4s ease;
      }
      .sc-card:hover .sc-ring { opacity: 1; animation: scRing 4.5s linear infinite; }

      /* preview stage */
      .sc-stage {
        position: relative; margin: 10px 10px 0; border-radius: 18px; overflow: hidden;
        aspect-ratio: 16 / 10;
        background: #060607;
      }
      .sc-stage-img { position: absolute; inset: 0; }
      .sc-stage-img.is-light { background: #f4f5f4; }
      .sc-hero-img { transition: transform 0.9s cubic-bezier(0.16,1,0.3,1); will-change: transform; }
      .sc-card:hover .sc-hero-img { transform: scale(1.06); }
      .sc-stage-scrim {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, transparent 40%, rgba(6,6,7,0.5) 78%, #0a0a0b 100%);
      }
      .sc-stage-vignette {
        position: absolute; inset: 0; pointer-events: none;
        box-shadow: inset 0 0 60px rgba(0,0,0,0.55);
        background: radial-gradient(120% 90% at 50% 0%, transparent 55%, color-mix(in oklab, var(--accent) 10%, transparent));
        mix-blend-mode: screen; opacity: 0.7;
      }
      .sc-glare { position: absolute; inset: 0; pointer-events: none; z-index: 3; mix-blend-mode: soft-light; }
      .sc-shine {
        position: absolute; top: 0; bottom: 0; left: 0; width: 55%; z-index: 3; pointer-events: none;
        transform: translateX(-180%) skewX(-16deg);
        background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%);
      }
      .sc-card:hover .sc-shine { animation: scShine 0.95s cubic-bezier(0.4,0,0.2,1) forwards; }

      /* official / community classifier badge */
      .sc-kind {
        position: absolute; top: 11px; left: 12px; z-index: 6;
        display: inline-flex; align-items: center; gap: 0.35rem; overflow: hidden;
        border-radius: 9999px; padding: 0.28rem 0.66rem 0.28rem 0.56rem;
        font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
      }
      .sc-kind.is-official {
        color: #23180a;
        background: linear-gradient(135deg, var(--color-gold-200), var(--color-gold-400) 55%, var(--color-gold-300));
        border: 1px solid color-mix(in oklab, var(--color-gold-100) 70%, transparent);
        box-shadow: 0 4px 16px -4px color-mix(in oklab, var(--color-gold-400) 80%, transparent),
                    0 0 0 3px color-mix(in oklab, var(--color-gold-400) 18%, transparent);
      }
      .sc-kind.is-official svg { color: #23180a; }
      .sc-kind-shine {
        position: absolute; inset: 0; transform: translateX(-130%);
        background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%);
        animation: scKindShine 4.4s ease-in-out infinite; animation-delay: 1s;
      }
      .sc-kind.is-community {
        color: color-mix(in oklab, var(--accent) 62%, white);
        background: rgba(8,8,10,0.62);
        border: 1px solid color-mix(in oklab, var(--accent) 42%, transparent);
      }
      .sc-kind.is-community svg { color: color-mix(in oklab, var(--accent) 78%, white); }
      .sc-status {
        position: absolute; top: 11px; right: 12px; z-index: 5;
        display: inline-flex; align-items: center; gap: 0.4rem;
        border-radius: 9999px; padding: 0.24rem 0.6rem;
        font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
        border: 1px solid rgba(255,255,255,0.16); background: rgba(8,8,10,0.62);
        color: #fff;
      }
      .sc-status-dot { width: 6px; height: 6px; border-radius: 50%; }
      .sc-status.is-live .sc-status-dot { background: #34E29A; box-shadow: 0 0 8px #34E29A; animation: scPulse 2s ease-out infinite; }
      .sc-status.is-soon { color: var(--accent); border-color: color-mix(in oklab, var(--accent) 40%, transparent); }
      .sc-status.is-soon .sc-status-dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: scPulse 1.6s ease-out infinite; }

      .sc-mark { position: absolute; left: 14px; bottom: 14px; z-index: 5; }
      .sc-mark-pill {
        display: inline-flex; align-items: center; border-radius: 10px;
        padding: 0.4rem 0.6rem; border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      }
      .sc-mark-pill.is-light { background: rgba(255,255,255,0.9); }
      .sc-mark-pill.is-dark { background: rgba(8,8,10,0.66); border-color: rgba(255,255,255,0.14); }
      .sc-mark-text {
        font-family: var(--font-display); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
        color: #fff; padding: 0.42rem 0.7rem;
      }
      .sc-mark-avatar {
        display: block; width: 42px; height: 42px; border-radius: 12px; overflow: hidden;
        border: 2px solid rgba(255,255,255,0.55); box-shadow: 0 6px 20px rgba(0,0,0,0.45);
      }
      .sc-mark-avatar img { width: 100%; height: 100%; object-fit: cover; }

      /* floating product polaroid */
      .sc-poly {
        position: absolute; right: 14px; bottom: 14px; z-index: 5;
        transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
      }
      .sc-poly-inner {
        position: relative; display: block; width: 74px; height: 92px; border-radius: 12px; overflow: hidden;
        background: #fff; border: 3px solid #fff;
        box-shadow: 0 14px 30px -8px rgba(0,0,0,0.7);
        transform: rotate(6deg);
        transition: transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
      }
      .sc-card:hover .sc-poly-inner {
        transform: rotate(-3deg) translateY(-8px);
        box-shadow: 0 22px 44px -10px color-mix(in oklab, var(--accent) 55%, black);
      }

      /* coming-soon lock */
      .sc-lock {
        position: absolute; inset: 0; z-index: 4; pointer-events: none;
        background: linear-gradient(180deg, color-mix(in oklab, var(--accent) 8%, transparent), rgba(6,6,8,0.35));
        -webkit-backdrop-filter: saturate(115%); backdrop-filter: saturate(115%);
      }
      .sc-radar {
        position: absolute; left: 50%; top: 40%; width: 150%; aspect-ratio: 1;
        transform: translate(-50%,-50%);
        background: conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent) 34%, transparent) 26deg, transparent 60deg);
        -webkit-mask: radial-gradient(closest-side, #000 0 62%, transparent 64%);
        mask: radial-gradient(closest-side, #000 0 62%, transparent 64%);
        opacity: 0.55; animation: scRadar 5.5s linear infinite;
      }
      .sc-lock-badge {
        position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
        display: inline-flex; align-items: center; gap: 0.4rem;
        border-radius: 9999px; padding: 0.4rem 0.85rem;
        font-size: 0.66rem; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
        color: #0a0a0b; background: var(--accent);
        box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 24%, transparent), 0 10px 26px -8px var(--accent);
        animation: scFloatY 3.2s ease-in-out infinite;
      }

      .sc-body { position: relative; z-index: 5; padding: 18px 20px 20px; }
      .sc-kind-eyebrow {
        display: block; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
      }
      .sc-kind-eyebrow.is-official {
        background: linear-gradient(92deg, var(--color-gold-200), var(--color-gold-400), var(--color-gold-200));
        background-size: 200% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        animation: scTitleShine 5s linear infinite;
      }
      .sc-kind-eyebrow.is-community { color: color-mix(in oklab, var(--accent) 46%, var(--color-mag-muted)); }
      .sc-verified { color: var(--color-gold-400); filter: drop-shadow(0 0 6px color-mix(in oklab, var(--color-gold-400) 55%, transparent)); }
      .sc-name { color: var(--color-mag-white); transition: color 0.3s ease; }
      .sc-card:hover .sc-name { color: color-mix(in oklab, var(--accent) 65%, white); }
      .sc-card.is-official:hover .sc-name { color: color-mix(in oklab, var(--color-gold-300) 80%, white); }
      .sc-tagline { color: color-mix(in oklab, var(--accent) 80%, white); }
      .sc-chip {
        border-radius: 9999px; padding: 0.26rem 0.66rem;
        border: 1px solid color-mix(in oklab, var(--accent) 22%, var(--color-mag-border));
        background: color-mix(in oklab, var(--accent) 7%, transparent);
        font-size: 0.68rem; font-weight: 600; letter-spacing: 0.03em;
        color: color-mix(in oklab, var(--accent) 40%, var(--color-mag-light));
      }
      .sc-cta {
        margin-top: 18px; display: inline-flex; align-items: center; gap: 0.5rem;
        font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
        color: color-mix(in oklab, var(--accent) 78%, white);
      }
      .sc-cta-arrow { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
      .sc-card:hover .sc-cta-arrow { transform: translate(3px,-3px); }
      .sc-cta.is-soon { color: color-mix(in oklab, var(--accent) 88%, white); }

      /* ── Cover plate ────────────────────────────────────────────────────
         At lg the flagship takes the 7fr track as a full-height portrait plate
         and the two community stores stack in the 5fr track. Nothing here
         restyles a card: it is one card resolving its stage height a different
         way, plus the proportional recalibrations that keeps honest. Below lg
         none of this applies and every card renders exactly as before.

         The flagship is addressed structurally rather than with a modifier
         class — it is the only .sc-card-shell that is a DIRECT child of the
         gallery, since the community pair sits one level deeper inside the
         column wrapper. That is why StoreCard needs no new prop and no JS
         here changed at all.

         Why the stage must be FLEXIBLE rather than given a second fixed
         ratio: card height is a fixed function of card width while the stage
         is aspect-locked, so flushing one card against two solves as
           0.625·W1 + 245 = 1.25·W2 + 600,  W1 + W2 = 1092  ->  W2 = 175px.
         There is no width at which one aspect-locked card is as tall as two.
         A hand-picked aspect-ratio would leave a ragged bottom edge, and go
         ragged again the first time a blurb is edited. Do not "simplify"
         .sc-stage back to a fixed ratio in here. */
      @media (min-width: 1024px) {

        /* Height chain: the grid row is sized by the right column, and each
           of these hands that height down to the key art. All four are
           load-bearing; none of them is styling. */
        .sc-gallery > .sc-card-shell { display: flex; flex-direction: column; }
        .sc-gallery > .sc-card-shell > .sc-card {
          flex: 1 1 auto;
          display: flex; flex-direction: column;
        }
        .sc-gallery > .sc-card-shell > .sc-card > .sc-card-tilt {
          display: flex; flex-direction: column;
          flex: 1 1 auto; min-height: 0;
        }

        /* The plate. No fixed ratio — it absorbs whatever the right column
           leaves over, so the flagship's bottom edge lands flush with the
           second community card at every viewport from 1024px up.

           .sc-stage has ZERO in-flow children (hero, scrims, shine, glare,
           badges and polaroid are every one of them position:absolute), so
           its flex-basis resolves to 0 and its height is entirely flex-grow
           plus this floor. Add a static child to the stage and the plate's
           height changes. The floor only covers the degenerate case where the
           right column ends up shorter than the plate's natural height; it is
           not reached with the current copy. */
        .sc-gallery > .sc-card-shell .sc-stage {
          aspect-ratio: auto;
          flex: 1 1 auto;
          min-height: 460px;
        }

        /* Keep the body at its intrinsic height. Without this it could grow
           and the plate would stop absorbing the slack, quietly killing the
           flush baseline that is the whole point of the arrangement. */
        .sc-gallery > .sc-card-shell .sc-body { flex: 0 0 auto; }

        /* Guard the community pair against shrinking if the column ever runs
           short. Their 16/10 stage is not at risk from stretch — in a flex
           column the cross-axis is horizontal, so aspect-ratio is untouched. */
        .sc-gallery > div > .sc-card-shell { flex: 0 0 auto; }

        /* Tilt keystone. rotateX is ±6.5deg on both shapes, but the near edge
           of the tall plate travels roughly twice as far toward the viewer as
           a community card's does. At the shared perspective of 1300 that is
           about a 4.8% width differential across the plate against 2.3% on
           its neighbours — it would visibly wobble twice as hard, reading as
           flapping paper rather than parallax. Matching the keystone needs
           perspective alone to move, which is why TILT stays a single 6.5 for
           every card and no JavaScript forked.

           !important because perspective is an inline style on .sc-card, and
           a stylesheet cannot beat an inline declaration without it. It is
           the one !important here and it is the price of not forking the
           component. Accepted consequence: the badges' translateZ pop
           flattens on the plate, which is the correct read for an object
           twice the size — the polaroid is scaled up below to compensate. */
        .sc-gallery > .sc-card-shell > .sc-card { perspective: 2700px !important; }

        /* The scrim was a percentage fade tuned for a short stage; stretched
           over the plate it would swallow the lower third of the art.
           Re-expressed from the bottom in absolute px, these stops reproduce
           the community card's scrim exactly rather than approximating it. */
        .sc-gallery > .sc-card-shell .sc-stage-scrim {
          background: linear-gradient(0deg, #0a0a0b 0, rgba(6,6,7,0.5) 60px, transparent 162px);
        }

        /* A 60px inset vignette reads thin on a plate this wide. 96px holds it
           at about the same share of the frame as on a community stage. */
        .sc-gallery > .sc-card-shell .sc-stage-vignette {
          box-shadow: inset 0 0 96px rgba(0,0,0,0.55);
        }

        /* The polaroid is an ornament pinned to a corner, so it scales with
           the stage's WIDTH, not its height — it holds the same ~17% of the
           frame it has on a community card. Border and hover lift go up with
           it to keep the frame weight and travel proportional. (The
           reduced-motion block's transform:none !important still overrides
           the hover rule, so nothing needs adding there.) */
        .sc-gallery > .sc-card-shell .sc-poly-inner {
          width: 104px; height: 130px; border-width: 4px;
        }
        .sc-gallery > .sc-card-shell .sc-card:hover .sc-poly-inner {
          transform: rotate(-3deg) translateY(-11px);
        }

        /* The plate's body sits on a much wider measure than a community
           card's — around 85 characters at 14px, well past the readable 45-75
           range, and a long line at a small size is the most reliable
           cheap-looking tell in editorial layout. 62ch brings it back to ~64.
           Safe as written: .sc-body's only direct <p> child is the blurb; the
           tagline is nested inside the header row, so > p cannot reach it. */
        .sc-gallery > .sc-card-shell .sc-body > p { max-width: 62ch; }
      }

      @keyframes scRing { to { transform: rotate(360deg); } }
      @keyframes scShine { to { transform: translateX(320%) skewX(-16deg); } }
      @keyframes scKindShine { 0% { transform: translateX(-130%); } 45%, 100% { transform: translateX(320%); } }
      @keyframes scTitleShine { to { background-position: -220% center; } }
      @keyframes scPulse { 0% { box-shadow: 0 0 0 0 color-mix(in oklab, currentColor 60%, transparent); } 70%,100% { box-shadow: 0 0 0 8px transparent; } }
      @keyframes scRadar { to { transform: translate(-50%,-50%) rotate(360deg); } }
      @keyframes scFloatY { 0%,100% { transform: translate(-50%,-50%); } 50% { transform: translate(-50%,-58%); } }
      @keyframes scCoin {
        0%,100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-16px) rotate(var(--r, 10deg)); }
      }

      @media (prefers-reduced-motion: reduce) {
        .sc-title, .sc-eyebrow-dot, .sc-coin, .sc-ring, .sc-shine, .sc-radar,
        .sc-lock-badge, .sc-status-dot, .sc-kind-shine, .sc-kind-eyebrow.is-official { animation: none !important; }
        .sc-card:hover .sc-hero-img,
        .sc-card:hover .sc-poly-inner { transform: none !important; }
        /* useReducedMotion() returns false during SSR, so the pre-hydration
           HTML ships the reveal's translateY(34px) to a reader who asked for
           no motion, and framer then animates it out. Pin the shell instead —
           safe because the shell carries no transform outside that reveal
           (the tilt lives on .sc-card-tilt). Pre-existing, fixed here. */
        .sc-card-shell { transform: none !important; }
        .sc-title, .sc-kind-eyebrow.is-official { background-position: 0 center; }
        .sc-coin { display: none; }
      }
    `}</style>
  );
}
