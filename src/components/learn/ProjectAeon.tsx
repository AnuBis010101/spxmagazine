"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
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

/* Copy is reproduced verbatim from the community site this page documents
   (aeons6900.com/aeons), at the editor's request, and is credited and linked
   at the foot of the page. Held as string constants rather than inline JSX so
   that quoting, apostrophes and the hyphen in "3333 Aeons - beings" survive
   exactly as written. */
const SOURCE_URL = "https://www.aeons6900.com/aeons";

const HERO_QUESTION =
  "if we could harness the power of God, could we flip the SPX500?";

const HERO_LINES = [
  "Deep within the clandestine vaults of SPX6900 Labs, a radical research experiment codenamed \"Project AEON\" sought the answer to this question.",
  "But then, the unexpected happened. A phenomenon known as a quantum glitch occurred, sparking life into 3333 Aeons - beings neither of this world nor wholly apart from it.",
  "These entities, birthed from the crucible of human ambition and cosmic anomaly, could save us.",
];

const SECTIONS = [
  {
    index: "01",
    title: "Cosmic Anomalies",
    body: "In the shadowy recesses of quantum experimentation, Project AEON emerges as a groundbreaking digital narrative brought to life through the Ethereum blockchain. This collection of 3,333 uniquely crafted entities, known as Aeons, is the result of a fictional \"quantum glitch\" from the enigmatic SPX6900 Labs. Each Aeon represents a fusion of cosmic anomaly and human ambition, embodying stories of creation, chaos, and transcendence.",
  },
  {
    index: "02",
    title: "Beyond Comprehension",
    body: "Within the collection lies a tapestry of intrigue, blending cutting-edge generative artistry with a rich backstory of scientific ambition gone awry. The Aeons, brought into existence by forces beyond comprehension, carry an aura of mystery and allure, inviting collectors to uncover their secrets. With visually striking designs and a narrative steeped in curiosity, Project AEON bridges the realms of art, technology, and speculative fiction.",
  },
  {
    index: "03",
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

/** Card that tilts an INNER layer — the frame keeps :hover so it never flickers. */
function LoreCard({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const shell = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function onMove(e: React.PointerEvent) {
    if (reduce || !shell.current) return;
    const r = shell.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 7, ry: (px - 0.5) * 7 });
  }

  return (
    <div
      ref={shell}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
      className="pa-card group/pa"
    >
      <motion.div
        className="pa-card-inner"
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
      >
        <span aria-hidden className="pa-card-sheen" />
        <span className="pa-index">{index}</span>
        <h3 className="pa-card-title font-display">{title}</h3>
        <div className="pa-card-body">{children}</div>
      </motion.div>
    </div>
  );
}

export default function ProjectAeon() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

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
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="pa-eyebrow"
          >
            <Sparkles className="h-3 w-3" />
            The Cognisphere Files
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

      {/* ── The glitch ───────────────────────────────────────────────── */}
      <section className="pa-section">
        <div className="pa-rule" />
        <div className="pa-lore">
          {SECTIONS.map((sec) => (
            <LoreCard key={sec.index} index={sec.index} title={sec.title}>
              {sec.body}
            </LoreCard>
          ))}
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

      {/* ── Why it matters ───────────────────────────────────────────── */}
      <section className="pa-section">
        <div className="pa-rule" />
        <div className="pa-split">
          <div>
            <h2 className="pa-h2 font-display">Art, technology and speculative fiction</h2>
            <p className="pa-body">
              Project AEON sits where generative artistry meets a story about
              science overreaching itself. The images are the surface; the pull
              is the backstory underneath them, which invites you to work out
              what the laboratory was really doing and what it let out.
            </p>
            <p className="pa-body">
              That is the same instinct the movement runs on. SPX6900 and the
              Aeons share one narrative universe — the coin supplies the fuel and
              the collection supplies the myth, and neither is trying very hard
              to pretend it is only a joke.
            </p>
          </div>
          <div className="pa-quote">
            <span aria-hidden className="pa-quote-mark">&ldquo;</span>
            <p>
              Beings neither of this world nor wholly apart from it.
            </p>
          </div>
        </div>
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
          <p className="pa-credit">
            Lore text courtesy of the SPX6900 community site,{" "}
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              aeons6900.com
            </a>
            .
          </p>
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

      /* ── lore cards ── */
      .pa-lore {
        display: grid; gap: 1.25rem;
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
      }
      .pa-card { perspective: 1000px; }
      .pa-card-inner {
        position: relative; overflow: hidden; height: 100%;
        border-radius: 20px; padding: 1.6rem 1.5rem 1.8rem;
        transform-style: preserve-3d;
        border: 1px solid var(--color-mag-border);
        background:
          radial-gradient(120% 90% at 50% -20%, color-mix(in oklab, var(--color-gold-400) 10%, transparent), transparent 60%),
          linear-gradient(180deg, #101011, #0a0a0b 70%);
        transition: border-color 0.4s ease, box-shadow 0.4s ease;
      }
      .pa-card:hover .pa-card-inner {
        border-color: color-mix(in oklab, var(--color-gold-400) 46%, transparent);
        box-shadow: 0 26px 60px -34px color-mix(in oklab, var(--color-gold-400) 60%, black);
      }
      .pa-card-sheen {
        position: absolute; inset: 0; pointer-events: none;
        background: linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.09) 50%, transparent 68%);
        transform: translateX(-130%);
        transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
      }
      .pa-card:hover .pa-card-sheen { transform: translateX(130%); }
      .pa-index {
        font-family: var(--font-display); font-size: 0.72rem; font-weight: 800;
        letter-spacing: 0.2em; color: var(--color-gold-400);
      }
      .pa-card-title {
        margin-top: 0.55rem; font-size: 1.25rem; font-weight: 700;
        color: var(--color-mag-white); letter-spacing: -0.01em;
      }
      .pa-card-body {
        margin-top: 0.7rem; color: var(--color-mag-muted);
        font-size: 0.95rem; line-height: 1.75;
      }
      .pa-card-body strong { color: var(--color-gold-300); font-weight: 700; }

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

      /* ── split + quote ── */
      .pa-split {
        display: grid; gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
        align-items: center;
      }
      .pa-quote {
        position: relative; border-radius: 22px; padding: 2.4rem 2rem;
        border: 1px solid color-mix(in oklab, var(--color-gold-400) 22%, transparent);
        background:
          radial-gradient(110% 90% at 50% 0%, color-mix(in oklab, var(--color-gold-400) 11%, transparent), transparent 62%),
          #0a0a0b;
      }
      .pa-quote p {
        font-family: var(--font-display); font-size: clamp(1.25rem, 2.6vw, 1.8rem);
        line-height: 1.35; color: var(--color-mag-white); text-wrap: balance;
      }
      .pa-quote-mark {
        position: absolute; top: 0.2rem; left: 1.2rem;
        font-family: var(--font-display); font-size: 5rem; line-height: 1;
        color: color-mix(in oklab, var(--color-gold-400) 30%, transparent);
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
