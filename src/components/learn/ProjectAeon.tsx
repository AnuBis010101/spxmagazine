"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/animations/ScrollVelocity";

/* ─────────────────────────────────────────────────────────────────────────
   Project AEON — a long-form feature page for the Learn section.

   Built to feel like the rest of the magazine rather than the source site:
   gold on near-black, display type, scroll-driven reveals. Every effect is
   transform/opacity and reduced-motion guarded, and the artwork strip reuses
   the scroll-velocity marquee already in the codebase.
   ──────────────────────────────────────────────────────────────────────── */

const AEONS = Array.from({ length: 24 }, (_, i) => i + 1);

/* Copy is held as string constants rather than inline JSX so that the quoting,
   the curly apostrophe in AEON's and the hyphen in "3333 Aeons - beings"
   survive exactly as written. */
const HERO_QUESTION =
  "if we could harness the power of God, could we flip the S&P500?";

const HERO_LINES = [
  "Deep within the clandestine vaults of SPX6900 Labs, a radical research experiment codenamed \"Project AEON\" sought the answer to this question.",
  "But then, the unexpected happened. A phenomenon known as a quantum glitch occurred, sparking life into 3333 Aeons - beings neither of this world nor wholly apart from it.",
  "These entities, birthed from the crucible of human ambition and cosmic anomaly, could save us.",
];

const SECTIONS = [
  {
    index: "01",
    media: "aeons-1",
    title: "Cosmic Anomalies",
    body: "In the shadowy recesses of quantum experimentation, Project AEON emerges as a groundbreaking digital narrative brought to life through the Ethereum blockchain. This collection of 3,333 uniquely crafted entities, known as Aeons, is the result of a fictional \"quantum glitch\" from the enigmatic SPX6900 Labs. Each Aeon represents a fusion of cosmic anomaly and human ambition, embodying stories of creation, chaos, and transcendence.",
  },
  {
    index: "02",
    media: "aeons-2",
    title: "Beyond Comprehension",
    body: "Within the collection lies a tapestry of intrigue, blending cutting-edge generative artistry with a rich backstory of scientific ambition gone awry. The Aeons, brought into existence by forces beyond comprehension, carry an aura of mystery and allure, inviting collectors to uncover their secrets. With visually striking designs and a narrative steeped in curiosity, Project AEON bridges the realms of art, technology, and speculative fiction.",
  },
  {
    index: "03",
    media: "aeons-3",
    title: "SPX6900",
    body: "SPX6900 is closely tied to Project AEON NFTs, sharing a narrative universe built around quantum experimentation and digital creativity. The memecoin fuels the ecosystem, providing utility within AEON\u2019s sci-fi-inspired lore while uniting collectors and investors under a shared vision of blockchain-powered innovation and humor.",
  },
];

/** Counts to a target the first time it scrolls into view. */
function Tally({ to, duration = 1600 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    // Reduced motion never animates, so it needs no state write at all —
    // the target is rendered directly below.
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out-expo: fast out of the gate, long settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  const shown = reduce ? to : n;
  return <span ref={ref} className="tabular-nums">{shown.toLocaleString("en-US")}</span>;
}

export default function ProjectAeon() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  /* Which chapter owns the pinned stage. Derived straight from how far the
     chapter column has travelled past the viewport centre, which is
     deterministic — an IntersectionObserver band and framer's onViewportEnter
     both proved unreliable here, latching on the wrong chapter. */
  const [active, setActive] = useState(0);
  const panelsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: chapterProgress } = useScroll({
    target: panelsRef,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(chapterProgress, "change", (v) => {
    const i = Math.min(SECTIONS.length - 1, Math.max(0, Math.floor(v * SECTIONS.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  // Hero parallax: the artwork bed drifts slower than the copy above it.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const bedY = useTransform(p, [0, 1], ["0%", "18%"]);
  const bedFade = useTransform(p, [0, 1], [0.42, 0.05]);
  const copyY = useTransform(p, [0, 1], ["0%", "-14%"]);
  const copyFade = useTransform(p, [0, 0.75], [1, 0]);

  const title = "PROJECT AEON".split("");

  return (
    <div className="pa-root">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header ref={heroRef} className="pa-hero">
        <motion.div
          aria-hidden
          className="pa-bed"
          style={reduce ? undefined : { y: bedY, opacity: bedFade }}
        >
          {AEONS.slice(0, 18).map((n) => (
            <span key={n} className="pa-bed-cell">
              <Image
                src={`/aeon/aeon-${n}.jpg`}
                alt=""
                width={300}
                height={409}
                className="h-full w-full object-cover"
              />
            </span>
          ))}
        </motion.div>
        <span aria-hidden className="pa-bed-veil" />

        <motion.div
          className="pa-hero-copy"
          style={reduce ? undefined : { y: copyY, opacity: copyFade }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pa-logo"
          >
            <span aria-hidden className="pa-logo-ring" />
            <Image
              src="/aeon/pa-logo.png"
              alt="Project AEON"
              width={132}
              height={132}
              priority
            />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="pa-eyebrow"
          >
            NFT Collection
          </motion.span>

          <h1 className="pa-title font-display" aria-label="Project AEON">
            {title.map((c, i) => (
              <motion.span
                key={i}
                aria-hidden
                initial={{ opacity: 0, y: 34, rotateX: -70 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.75,
                  delay: 0.1 + i * 0.035,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={c === " " ? "pa-space" : "pa-glyph"}
              >
                {c === " " ? " " : c}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pa-lede pa-lede--question"
          >
            {HERO_QUESTION}
          </motion.p>

          <div className="pa-dossier">
            {HERO_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.68 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pa-stats"
          >
            <span className="pa-stat">
              <strong><Tally to={3333} /></strong>
              <em>Aeons</em>
            </span>
            <span className="pa-stat">
              <strong>ETH</strong>
              <em>Ethereum</em>
            </span>
            <span className="pa-stat">
              <strong>1 / 1</strong>
              <em>Each unique</em>
            </span>
          </motion.div>
        </motion.div>

        <span aria-hidden className="pa-hero-fade" />
      </header>

      {/* ── The three chapters: media pins, copy scrolls past ─────────── */}
      <section className="pa-showcase">
        <div className="pa-rule" />
        <div className="pa-showcase-grid">
          {/* Pinned stage — clips crossfade as each chapter takes over */}
          <div className="pa-stage-col">
            <div className="pa-stage">
              {SECTIONS.map((sec, i) => (
                <video
                  key={sec.media}
                  className={`pa-stage-media${active === i ? " is-on" : ""}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                  poster={`/aeon/aeon-${i * 8 + 1}.jpg`}
                >
                  <source src={`/aeon/${sec.media}.webm`} type="video/webm" />
                  <source src={`/aeon/${sec.media}.mp4`} type="video/mp4" />
                </video>
              ))}
              <span aria-hidden className="pa-stage-veil" />
              <span aria-hidden className="pa-stage-sheen" />
              <span aria-hidden className="pa-stage-frame" />
            </div>

            <div className="pa-rail" aria-hidden>
              {SECTIONS.map((sec, i) => (
                <span key={sec.index} className={`pa-rail-seg${active >= i ? " is-lit" : ""}`}>
                  <span className="pa-rail-fill" />
                </span>
              ))}
            </div>
          </div>

          {/* Chapters */}
          <div className="pa-panels" ref={panelsRef}>
            {SECTIONS.map((sec, i) => (
              <article
                key={sec.index}
                className={`pa-panel${active === i ? " is-active" : ""}`}
              >
                {/* Media inline on narrow screens, where nothing can pin */}
                <div className="pa-panel-media">
                  <video autoPlay loop muted playsInline preload="none" poster={`/aeon/aeon-${i * 8 + 1}.jpg`}>
                    <source src={`/aeon/${sec.media}.webm`} type="video/webm" />
                    <source src={`/aeon/${sec.media}.mp4`} type="video/mp4" />
                  </video>
                </div>

                <span className="pa-panel-index">{sec.index}</span>
                <h2 className="pa-panel-title font-display">{sec.title}</h2>
                <p className="pa-panel-body">{sec.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artwork strip ────────────────────────────────────────────── */}
      <section className="pa-strip-wrap">
        <h2 className="pa-h2 font-display">Three thousand three hundred and thirty-three</h2>
        <p className="pa-sub">
          Every Aeon is generated once and never repeated. Scroll — the strip
          answers.
        </p>
        <ScrollVelocityContainer className="pa-strip">
          <ScrollVelocityRow baseVelocity={4} direction={1}>
            {AEONS.slice(0, 12).map((n) => (
              <span key={n} className="pa-tile">
                <Image src={`/aeon/aeon-${n}.jpg`} alt={`Aeon ${n}`} width={220} height={300} />
              </span>
            ))}
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={4} direction={-1} className="mt-4">
            {AEONS.slice(12, 24).map((n) => (
              <span key={n} className="pa-tile">
                <Image src={`/aeon/aeon-${n}.jpg`} alt={`Aeon ${n}`} width={220} height={300} />
              </span>
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </section>

      {/* ── Where to look ────────────────────────────────────────────── */}
      <section className="pa-cta-wrap">
        <div className="pa-cta">
          <h2 className="pa-h2 font-display">See the collection</h2>
          <p className="pa-sub">
            Project AEON lives on Ethereum. Browse the full 3,333 on either
            marketplace.
          </p>
          <div className="pa-links">
            <a href="https://opensea.io/collection/project-aeon/overview" target="_blank" rel="noopener noreferrer" className="pa-link">
              OpenSea <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="https://blur.io/collection/project-aeon" target="_blank" rel="noopener noreferrer" className="pa-link pa-link--ghost">
              Blur <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link href="/learn" className="pa-link pa-link--ghost">
              Back to Guides
            </Link>
          </div>
        </div>
      </section>

      <ProjectAeonStyles />
    </div>
  );
}

function ProjectAeonStyles() {
  return (
    <style>{`
      .pa-root { --pa-gap: clamp(3rem, 7vw, 6rem); }

      /* ── hero ── */
      .pa-hero {
        position: relative; isolation: isolate; overflow: hidden;
        min-height: min(92vh, 900px);
        display: grid; place-items: center;
        padding: clamp(4rem, 12vh, 9rem) 1rem;
      }
      .pa-bed {
        position: absolute; inset: -12% -4% -4%;
        display: grid; gap: 10px;
        grid-template-columns: repeat(6, 1fr);
        z-index: -2;
      }
      .pa-bed-cell {
        position: relative; overflow: hidden; border-radius: 10px;
        aspect-ratio: 3 / 4;
      }
      .pa-bed-cell:nth-child(3n) { transform: translateY(-7%); }
      .pa-bed-cell:nth-child(4n) { transform: translateY(5%); }
      /* Static veil — a gradient, not a filter, so scrolling stays cheap. */
      .pa-bed-veil {
        position: absolute; inset: 0; z-index: -1; pointer-events: none;
        background:
          /* scrim directly behind the copy, so the collage never fights the type */
          radial-gradient(58% 44% at 50% 46%, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.72) 45%, transparent 78%),
          radial-gradient(95% 75% at 50% 42%, transparent 0%, var(--color-mag-black) 80%),
          linear-gradient(180deg, var(--color-mag-black) 0%, transparent 20%, transparent 60%, var(--color-mag-black) 100%);
      }
      .pa-hero-copy { position: relative; z-index: 1; text-align: center; max-width: 62rem; }
      /* Block-level and centred so the eyebrow sits on its own line beneath,
         rather than flowing alongside it. */
      .pa-logo {
        position: relative; display: grid; place-items: center;
        width: fit-content; margin: 0 auto 1.1rem;
      }
      .pa-logo img { position: relative; z-index: 1; width: clamp(84px, 12vw, 132px); height: auto; }
      .pa-logo-ring {
        position: absolute; inset: -18%;
        border-radius: 9999px;
        background: radial-gradient(circle, color-mix(in oklab, var(--color-gold-400) 30%, transparent), transparent 68%);
      }
      .pa-eyebrow {
        display: inline-flex; align-items: center; gap: 0.5rem;
        border-radius: 9999px; padding: 0.4rem 0.95rem;
        border: 1px solid color-mix(in oklab, var(--color-gold-400) 38%, transparent);
        background: color-mix(in oklab, var(--color-gold-400) 8%, transparent);
        font-size: 0.68rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
        color: var(--color-gold-300);
      }
      .pa-title {
        margin-top: 1.4rem;
        font-size: clamp(2.6rem, 11vw, 7.5rem);
        font-weight: 800; line-height: 0.94; letter-spacing: -0.03em;
        perspective: 800px;
      }
      .pa-glyph, .pa-space { display: inline-block; transform-origin: 50% 100%; }
      .pa-glyph {
        background: linear-gradient(110deg,
          var(--color-gold-500) 0%, var(--color-gold-300) 26%, #fff6d8 50%,
          var(--color-gold-300) 74%, var(--color-gold-500) 100%);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
      }
      .pa-lede {
        margin: 1.6rem auto 0; max-width: 44rem;
        font-size: clamp(1rem, 1.9vw, 1.2rem); line-height: 1.75;
        color: var(--color-mag-light);
      }
      .pa-lede--question {
        font-style: italic;
        color: var(--color-gold-200);
        font-size: clamp(1.05rem, 2.2vw, 1.45rem);
      }
      .pa-dossier {
        margin: 1.5rem auto 0; max-width: 46rem;
        display: flex; flex-direction: column; gap: 0.9rem;
        text-align: left;
        border-left: 1px solid color-mix(in oklab, var(--color-gold-400) 32%, transparent);
        padding-left: 1.4rem;
      }
      .pa-dossier p {
        color: var(--color-mag-light);
        font-size: clamp(0.94rem, 1.5vw, 1.03rem); line-height: 1.75;
      }
      .pa-credit {
        margin-top: 1.6rem; font-size: 0.8rem; color: var(--color-mag-muted);
      }
      .pa-credit a {
        color: var(--color-gold-300);
        text-decoration: underline; text-underline-offset: 3px;
        text-decoration-color: color-mix(in oklab, var(--color-gold-400) 45%, transparent);
      }
      .pa-stats {
        margin-top: 2.2rem; display: flex; flex-wrap: wrap;
        justify-content: center; gap: 1rem;
      }
      .pa-stat {
        display: flex; flex-direction: column; gap: 0.15rem;
        min-width: 8.5rem; padding: 0.85rem 1.4rem;
        border-radius: 14px;
        border: 1px solid var(--color-mag-border);
        background: color-mix(in oklab, var(--color-mag-white) 4%, transparent);
      }
      .pa-stat strong {
        font-family: var(--font-display); font-size: 1.6rem; font-weight: 700;
        color: var(--color-gold-300); line-height: 1;
      }
      .pa-stat em {
        font-style: normal; font-size: 0.68rem; letter-spacing: 0.16em;
        text-transform: uppercase; color: var(--color-mag-muted);
      }
      .pa-hero-fade {
        position: absolute; inset-inline: 0; bottom: 0; height: 22%;
        background: linear-gradient(180deg, transparent, var(--color-mag-black));
        pointer-events: none;
      }

      /* ── sections ── */
      .pa-section { max-width: 80rem; margin-inline: auto; padding: var(--pa-gap) 1rem; }
      .pa-rule {
        height: 1px; margin-bottom: clamp(2rem, 5vw, 3.5rem);
        background: linear-gradient(90deg, transparent,
          color-mix(in oklab, var(--color-gold-400) 34%, transparent), transparent);
      }
      .pa-h2 {
        font-size: clamp(1.6rem, 3.6vw, 2.6rem); font-weight: 700;
        line-height: 1.15; letter-spacing: -0.02em; color: var(--color-mag-white);
        text-wrap: balance;
      }
      .pa-sub { margin-top: 0.9rem; color: var(--color-mag-muted); font-size: 0.98rem; }
      .pa-body {
        margin-top: 1.1rem; color: var(--color-mag-light);
        font-size: 1.02rem; line-height: 1.85; text-wrap: pretty;
      }

      /* ── chapters: pinned stage + scrolling copy ── */
      .pa-showcase { max-width: 84rem; margin-inline: auto; padding: var(--pa-gap) 1rem; }
      .pa-showcase-grid {
        display: grid; gap: clamp(2rem, 5vw, 4rem);
        grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
        align-items: start;
      }
      .pa-stage-col { position: sticky; top: clamp(5rem, 12vh, 8rem); }

      .pa-stage {
        position: relative; overflow: hidden;
        border-radius: 26px; aspect-ratio: 16 / 9;
        background: #07070a;
        box-shadow:
          0 40px 90px -50px color-mix(in oklab, var(--color-gold-400) 70%, black),
          0 0 0 1px color-mix(in oklab, var(--color-gold-400) 16%, transparent);
      }
      .pa-stage-media {
        position: absolute; inset: 0; width: 100%; height: 100%;
        object-fit: cover;
        opacity: 0; transform: scale(1.06);
        transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                    transform 1.4s cubic-bezier(0.16,1,0.3,1);
      }
      .pa-stage-media.is-on { opacity: 1; transform: scale(1); }

      /* Gradient vignette so the numeral and frame read over any frame. */
      .pa-stage-veil {
        position: absolute; inset: 0; pointer-events: none;
        background:
          radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(7,7,10,0.55) 100%),
          linear-gradient(180deg, rgba(7,7,10,0.35) 0%, transparent 30%, transparent 62%, rgba(7,7,10,0.72) 100%);
      }
      .pa-stage-frame {
        position: absolute; inset: 10px; border-radius: 18px; pointer-events: none;
        border: 1px solid color-mix(in oklab, var(--color-gold-300) 30%, transparent);
      }
      .pa-stage-sheen {
        position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.10) 50%, transparent 62%);
        transform: translateX(-120%);
        animation: paSheen 7s cubic-bezier(0.6,0,0.2,1) infinite;
      }
      @keyframes paSheen {
        0% { transform: translateX(-120%); }
        45%, 100% { transform: translateX(120%); }
      }

      /* Progress rail under the stage */
      .pa-rail { display: flex; gap: 8px; margin-top: 1.1rem; }
      .pa-rail-seg {
        position: relative; flex: 1; height: 2px; border-radius: 9999px; overflow: hidden;
        background: color-mix(in oklab, var(--color-mag-white) 10%, transparent);
      }
      .pa-rail-fill {
        position: absolute; inset: 0; transform-origin: left center; transform: scaleX(0);
        background: linear-gradient(90deg, var(--color-gold-400), #fff6d8);
        transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
      }
      .pa-rail-seg.is-lit .pa-rail-fill { transform: scaleX(1); }

      /* Chapters column */
      .pa-panels { display: flex; flex-direction: column; }
      .pa-panel {
        min-height: 74vh; display: flex; flex-direction: column; justify-content: center;
        padding: clamp(1.5rem, 4vw, 2.5rem) 0;
        opacity: 0.34; transition: opacity 0.6s ease;
      }
      .pa-panel.is-active { opacity: 1; }
      .pa-panel-media { display: none; }
      .pa-panel-index {
        font-family: var(--font-display); font-size: 0.78rem; font-weight: 800;
        letter-spacing: 0.24em; color: var(--color-gold-400);
      }
      .pa-panel-title {
        margin-top: 0.6rem;
        font-size: clamp(1.7rem, 3.6vw, 2.8rem); font-weight: 700;
        line-height: 1.1; letter-spacing: -0.02em; color: var(--color-mag-white);
        text-wrap: balance;
      }
      .pa-panel-body {
        margin-top: 1.1rem; color: var(--color-mag-light);
        font-size: clamp(0.98rem, 1.5vw, 1.06rem); line-height: 1.85; text-wrap: pretty;
      }

      /* Below the two-column breakpoint nothing can pin: inline the clips. */
      @media (max-width: 900px) {
        .pa-showcase-grid { grid-template-columns: 1fr; }
        .pa-stage-col { display: none; }
        .pa-panel { min-height: 0; opacity: 1; padding-block: clamp(2rem, 8vw, 3rem); }
        .pa-panel-media { display: block; margin-bottom: 1.25rem; }
        .pa-panel-media video {
          width: 100%; border-radius: 18px; aspect-ratio: 16 / 9; object-fit: cover;
          border: 1px solid color-mix(in oklab, var(--color-gold-400) 20%, transparent);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .pa-stage-sheen { animation: none; opacity: 0; }
        .pa-stage-media { transition: opacity 0.2s linear; transform: none; }
      }

      /* ── artwork strip ── */
      .pa-strip-wrap {
        max-width: 80rem; margin-inline: auto;
        padding: var(--pa-gap) 0 calc(var(--pa-gap) * 0.6);
        text-align: center;
      }
      .pa-strip-wrap .pa-h2, .pa-strip-wrap .pa-sub { padding-inline: 1rem; }
      .pa-strip {
        margin-top: 2.2rem;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
      }
      .pa-tile {
        display: block; margin-right: 14px; border-radius: 14px; overflow: hidden;
        border: 1px solid var(--color-mag-border);
        transition: border-color 0.35s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1);
      }
      .pa-tile img { display: block; width: 168px; height: auto; }
      .pa-tile:hover {
        border-color: color-mix(in oklab, var(--color-gold-400) 60%, transparent);
        transform: translateY(-4px);
      }

      /* ── cta ── */
      .pa-cta-wrap { max-width: 80rem; margin-inline: auto; padding: 0 1rem var(--pa-gap); }
      .pa-cta {
        border-radius: 24px; padding: clamp(2.2rem, 6vw, 3.6rem);
        text-align: center;
        border: 1px solid color-mix(in oklab, var(--color-gold-400) 20%, transparent);
        background:
          radial-gradient(100% 120% at 50% 0%, color-mix(in oklab, var(--color-gold-400) 12%, transparent), transparent 64%),
          #0a0a0b;
      }
      .pa-links { margin-top: 1.6rem; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
      .pa-link {
        display: inline-flex; align-items: center; gap: 0.45rem;
        border-radius: 9999px; padding: 0.7rem 1.4rem;
        font-size: 0.9rem; font-weight: 700;
        color: #0a0a0b;
        background: linear-gradient(135deg, var(--color-gold-200), var(--color-gold-400));
        transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease;
      }
      .pa-link:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -14px color-mix(in oklab, var(--color-gold-400) 80%, transparent); }
      .pa-link--ghost {
        color: var(--color-gold-300); background: transparent;
        border: 1px solid color-mix(in oklab, var(--color-gold-400) 40%, transparent);
      }
      .pa-link--ghost:hover { background: color-mix(in oklab, var(--color-gold-400) 10%, transparent); }

      @media (max-width: 640px) {
        .pa-bed { grid-template-columns: repeat(4, 1fr); }
      }
      @media (prefers-reduced-motion: reduce) {
        .pa-card-sheen, .pa-tile, .pa-link { transition: none; }
      }
    `}</style>
  );
}
