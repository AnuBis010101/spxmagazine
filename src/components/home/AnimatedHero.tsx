"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import GoldParticles from "@/components/animations/GoldParticles";
import TextReveal from "@/components/animations/TextReveal";
import type { Post } from "@/types/content";

const contentTypePathMap: Record<string, string> = {
  news: "/news/",
  article: "/articles/",
  learn: "/learn/",
};

interface AnimatedHeroProps {
  post: Post | null;
  glossaryTerms?: string[];
}

/* ── Typewriter that cycles through phrases ── */
function TypewriterCycle({ phrases }: { phrases: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[idx];
    const speed = isDeleting ? 25 : 50;

    if (!isDeleting && displayed === phrase) {
      const t = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setIdx((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(() => {
      setDisplayed(
        isDeleting ? phrase.slice(0, displayed.length - 1) : phrase.slice(0, displayed.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, isDeleting, idx, phrases]);

  return (
    <span className="text-mag-muted font-body text-base sm:text-lg md:text-xl">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-[1em] bg-gold-400 ml-0.5 align-baseline"
      />
    </span>
  );
}

/* ── Headline ticker marquee ── */
function TickerStrip({ words, direction, speed, className }: {
  words: string[]; direction: 1 | -1; speed: number; className?: string;
}) {
  const text = words.join("  ·  ");
  const tripled = `${text}  ·  ${text}  ·  ${text}`;
  return (
    <div className={`absolute w-full overflow-hidden pointer-events-none ${className ?? ""}`}>
      <motion.div
        className="whitespace-nowrap font-display text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gold-400/[0.08]"
        animate={{ x: direction === 1 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {tripled}
      </motion.div>
    </div>
  );
}

/* ── Floating glossary term ── */
function FloatingTerm({ term, config }: {
  term: string;
  config: { x: string; y: string; size: number; dur: number; delay: number; drift: number };
}) {
  return (
    <motion.span
      className="absolute whitespace-nowrap font-display font-bold select-none pointer-events-none"
      style={{ left: config.x, top: config.y, fontSize: config.size }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.12, 0.05, 0.1, 0],
        y: [0, -config.drift, config.drift * 0.5, -config.drift * 0.3, 0],
        x: [0, config.drift * 0.4, -config.drift * 0.6, config.drift * 0.2, 0],
        scale: [1, 1.05, 0.95, 1.02, 1],
      }}
      transition={{ duration: config.dur, delay: config.delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="bg-gradient-to-r from-gold-400/30 via-gold-300/50 to-gold-400/30 bg-clip-text text-transparent">
        {term}
      </span>
    </motion.span>
  );
}

/* ── Ink ripple ── */
function InkRipple({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none border border-gold-400/20"
      style={{ left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      animate={{ scale: [0, 3, 5], opacity: [0.2, 0.05, 0] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ── Flying term that crosses screen ── */
function FlyingTerm({ term, delay, fromLeft }: { term: string; delay: number; fromLeft: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none whitespace-nowrap font-display text-sm sm:text-base font-bold"
      style={{ top: `${20 + Math.random() * 60}%` }}
      initial={{ x: fromLeft ? "-100vw" : "100vw", opacity: 0 }}
      animate={{
        x: fromLeft ? "100vw" : "-100vw",
        opacity: [0, 0.15, 0.15, 0],
      }}
      transition={{
        duration: 12 + Math.random() * 8,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <span className="bg-gradient-to-r from-gold-400/20 via-gold-300/40 to-gold-400/20 bg-clip-text text-transparent">
        {term}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN HERO COMPONENT
   ═══════════════════════════════════════════════════ */
export default function AnimatedHero({ post, glossaryTerms = [] }: AnimatedHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const terms = glossaryTerms.length > 0 ? glossaryTerms : [
    "Cognisphere", "SPX6900", "Flippening", "Murad", "Polymetric",
    "S&P 500", "Diamond Hands", "WAGMI", "Community", "Onchain",
    "Decentralized", "Movement", "Believe", "Revolution", "Cathedral",
    "Aeon", "DCA", "The Ticker", "6900", "Euphoria",
  ];

  const floatingConfigs = useMemo(() => {
    if (!mounted) return [];
    return terms.slice(0, 24).map(() => ({
      x: `${Math.random() * 90 + 5}%`,
      y: `${Math.random() * 80 + 10}%`,
      size: Math.random() * 20 + 12,
      dur: Math.random() * 18 + 14,
      delay: Math.random() * 8,
      drift: Math.random() * 35 + 15,
    }));
  }, [mounted, terms]);

  const typewriterPhrases = [
    "The Voice of SPX6900",
    "News · Analysis · Culture",
    "Enter the Cognisphere",
    "Where Ideas Become Movements",
    "Beyond the S&P 500",
  ];

  const tickerTerms1 = terms.slice(0, 12);
  const tickerTerms2 = [...terms].reverse().slice(0, 12);

  /* ─── FALLBACK HERO (no post) — scrolls normally ─── */
  if (!post) {
    return (
      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={mounted ? { height: "calc(100svh - 102px)" } : { height: "100svh" }}
      >
        {/* Decorative elements inside the hero (scroll with it) */}
        {mounted && (
          <>
            <TickerStrip words={tickerTerms1} direction={1} speed={50} className="top-[15%]" />
            <TickerStrip words={tickerTerms2} direction={-1} speed={60} className="top-[30%]" />
            <TickerStrip words={tickerTerms1} direction={1} speed={55} className="top-[70%]" />
            <TickerStrip words={tickerTerms2} direction={-1} speed={45} className="top-[85%]" />
          </>
        )}

        {/* Floating glossary terms */}
        {floatingConfigs.map((cfg, i) => (
          <FloatingTerm key={i} term={terms[i % terms.length]} config={cfg} />
        ))}

        {/* Flying terms */}
        {mounted && terms.slice(0, 6).map((term, i) => (
          <FlyingTerm key={`fly-${i}`} term={term} delay={i * 3} fromLeft={i % 2 === 0} />
        ))}

        {/* Ink ripples */}
        <InkRipple delay={0} x="25%" y="35%" size={60} />
        <InkRipple delay={2.5} x="72%" y="28%" size={50} />
        <InkRipple delay={5} x="50%" y="65%" size={70} />
        <InkRipple delay={7.5} x="35%" y="78%" size={55} />
        <InkRipple delay={1.5} x="65%" y="55%" size={45} />

        {/* Gold particles */}
        <GoldParticles count={12} />

        {/* ═══ CENTER CONTENT — positioned at orbit center (50vh from viewport top) ═══ */}
        <div
          className="absolute z-10 left-0 right-0 flex justify-center"
          style={mounted ? { top: "calc(50svh - 102px)", transform: "translateY(-50%)" } : { top: "50%", transform: "translateY(-50%)" }}
        >
        <motion.div
          className="flex flex-col items-center text-center px-4 w-full max-w-3xl"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 150, damping: 20 }}
          >
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/spxlogo.png"
                alt="SPX6900 Logo"
                width={100}
                height={100}
                className="mx-auto w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <TextReveal
            text="SPX MAGAZINE"
            as="h1"
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mt-6"
            wordClassName="text-gold-gradient"
          />

          {/* Animated divider */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-5 mb-4"
            initial={{ width: 0 }}
            animate={{ width: "min(200px, 60vw)" }}
            transition={{ duration: 1, delay: 0.6 }}
          />

          {/* Typewriter subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-7"
          >
            <TypewriterCycle phrases={typewriterPhrases} />
          </motion.div>

          {/* Category pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {["News", "Articles", "Guides", "Videos", "Glossary"].map((label, i) => (
              <motion.span
                key={label}
                className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gold-400/20 bg-gold-400/[0.04] text-[10px] sm:text-xs font-display font-semibold text-gold-400/50 tracking-wider uppercase cursor-default"
                animate={{
                  borderColor: ["rgba(212,175,55,0.12)", "rgba(212,175,55,0.35)", "rgba(212,175,55,0.12)"],
                  color: ["rgba(212,175,55,0.4)", "rgba(212,175,55,0.7)", "rgba(212,175,55,0.4)"],
                }}
                transition={{ duration: 3, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, borderColor: "rgba(212,175,55,0.6)" }}
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ opacity: contentOpacity }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400/40 font-display">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold-400/60">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* Edge fade at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-mag-black/60 to-transparent pointer-events-none" />
      </section>
    );
  }

  /* ─── HERO WITH POST ─── */
  const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;

  return (
    <section ref={sectionRef} className="relative h-[100svh] overflow-hidden">
      {/* Parallax background image */}
      {post.cover_image && (
        <motion.div className="absolute inset-0" style={{ y: backgroundY, scale: imageScale }}>
          <Image
            src={post.cover_image}
            alt={post.cover_image_alt ?? post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
      )}

      {/* Triple gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-mag-black via-mag-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-mag-black/40 via-transparent to-mag-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-mag-black/30 via-transparent to-transparent" />

      {/* Floating particles */}
      <GoldParticles count={8} />

      {/* Content with scroll fade */}
      <motion.div
        className="relative z-10 flex items-end h-full"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full">
          {post.category && (
            <motion.span
              className="inline-block bg-gold-400 text-mag-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {post.category.name}
            </motion.span>
          )}

          <TextReveal
            text={post.title}
            as="h1"
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mt-4"
            staggerDelay={0.06}
          />

          {post.excerpt && (
            <motion.p
              className="text-lg md:text-xl text-mag-light/80 mt-5 max-w-2xl line-clamp-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {post.excerpt}
            </motion.p>
          )}

          <motion.div
            className="flex items-center gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-mag-muted">
              <span>{post.author_name}</span>
            </div>
            <Link
              href={href}
              className="group relative bg-gold-400 text-mag-black px-6 py-2.5 rounded-full font-semibold overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <span className="relative z-10">Read Article</span>
              <motion.div
                className="absolute inset-0 bg-gold-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: contentOpacity }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold-400">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
