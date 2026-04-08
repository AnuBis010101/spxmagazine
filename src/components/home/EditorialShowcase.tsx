"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface EditorialShowcaseProps {
  glossaryTerms: string[];
}

/* ── Floating glossary word ── */
function FloatingTerm({
  term,
  style,
}: {
  term: string;
  style: { left: string; top: string; size: number; duration: number; delay: number; drift: number; rotation: number };
}) {
  return (
    <motion.span
      className="absolute whitespace-nowrap font-display select-none pointer-events-none"
      style={{
        left: style.left,
        top: style.top,
        fontSize: style.size,
        color: "rgba(212,175,55,0.08)",
      }}
      animate={{
        y: [0, style.drift, -style.drift * 0.6, style.drift * 0.3, 0],
        x: [0, -style.drift * 0.5, style.drift * 0.7, -style.drift * 0.3, 0],
        rotate: [0, style.rotation, -style.rotation * 0.5, style.rotation * 0.3, 0],
        opacity: [0.06, 0.14, 0.06, 0.12, 0.06],
      }}
      transition={{
        duration: style.duration,
        delay: style.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {term}
    </motion.span>
  );
}

/* ── Typewriter line that cycles through phrases ── */
function TypewriterCycle({ phrases, className }: { phrases: string[]; className?: string }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[idx];
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && displayed === phrase) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }
    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setIdx((i) => (i + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayed(
        isDeleting ? phrase.slice(0, displayed.length - 1) : phrase.slice(0, displayed.length + 1)
      );
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, idx, phrases]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-[1em] bg-gold-400 ml-0.5 align-baseline"
      />
    </span>
  );
}

/* ── Orbiting term around the center ── */
function OrbitingTerm({
  term,
  radius,
  duration,
  startAngle,
  size,
}: {
  term: string;
  radius: number;
  duration: number;
  startAngle: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{ width: 0, height: 0 }}
      animate={{ rotate: [startAngle, startAngle + 360] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <motion.span
        className="absolute whitespace-nowrap font-display font-semibold"
        style={{
          left: radius,
          top: -size / 2,
          fontSize: size,
        }}
        animate={{ rotate: [-(startAngle), -(startAngle + 360)] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <span className="bg-gradient-to-r from-gold-400/40 via-gold-300/60 to-gold-400/40 bg-clip-text text-transparent">
          {term}
        </span>
      </motion.span>
    </motion.div>
  );
}

/* ── Flying headline strip ── */
function HeadlineStrip({ words, direction, speed, y }: { words: string[]; direction: 1 | -1; speed: number; y: string }) {
  const text = words.join(" · ");
  const doubled = `${text} · ${text} · ${text}`;
  return (
    <div className="absolute w-full overflow-hidden pointer-events-none" style={{ top: y }}>
      <motion.div
        className="whitespace-nowrap font-display text-[11px] sm:text-xs tracking-[0.3em] uppercase"
        style={{ color: "rgba(212,175,55,0.12)" }}
        animate={{ x: direction === 1 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled}
      </motion.div>
    </div>
  );
}

/* ── Scattered article fragment ── */
function ArticleFragment({
  term,
  definition,
  style,
}: {
  term: string;
  definition: string;
  style: { left: string; top: string; rotate: number; delay: number; width: number };
}) {
  return (
    <motion.div
      className="absolute hidden md:block pointer-events-none"
      style={{
        left: style.left,
        top: style.top,
        width: style.width,
        rotate: style.rotate,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 0.06, 0.1, 0.06, 0],
        scale: [0.8, 1, 1.02, 1, 0.8],
        y: [0, -10, 5, -5, 0],
      }}
      transition={{ duration: 12, delay: style.delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="border border-gold-400/10 rounded-lg p-3 backdrop-blur-sm bg-gold-400/[0.02]">
        <div className="h-0.5 w-8 bg-gold-400/20 rounded mb-2" />
        <p className="font-display text-[10px] font-bold text-gold-400/20 uppercase tracking-wider mb-1">
          {term}
        </p>
        <p className="text-[9px] text-mag-muted/30 leading-relaxed line-clamp-3">
          {definition}
        </p>
        <div className="flex gap-1 mt-2">
          <div className="h-px flex-1 bg-gold-400/10" />
          <div className="h-px w-4 bg-gold-400/20" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Ink drop ripple ── */
function InkDrop({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      animate={{
        scale: [0, 2.5, 4],
        opacity: [0.15, 0.06, 0],
        borderWidth: [2, 1, 0.5],
      }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeOut" }}
    >
      <div className="w-full h-full rounded-full border border-gold-400/30" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function EditorialShowcase({ glossaryTerms }: EditorialShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rotateCenter = useTransform(scrollYProgress, [0, 1], [0, 8]);

  // Fallback terms if DB is empty
  const terms = glossaryTerms.length > 0 ? glossaryTerms : [
    "Cognisphere", "SPX6900", "Flippening", "Murad", "Polymetric",
    "S&P 500", "Diamond Hands", "WAGMI", "Community", "Onchain",
    "Decentralized", "Movement", "Believe", "Revolution", "Cathedral",
  ];

  // Generate stable random layouts client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const floatingStyles = useMemo(() => {
    if (!mounted) return [];
    return terms.slice(0, 20).map(() => ({
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 24 + 14,
      duration: Math.random() * 15 + 12,
      delay: Math.random() * 5,
      drift: Math.random() * 40 + 20,
      rotation: (Math.random() - 0.5) * 16,
    }));
  }, [mounted, terms]);

  const fragmentStyles = useMemo(() => {
    if (!mounted) return [];
    return [
      { left: "5%", top: "15%", rotate: -6, delay: 0, width: 160 },
      { left: "78%", top: "20%", rotate: 4, delay: 3, width: 150 },
      { left: "8%", top: "65%", rotate: 3, delay: 6, width: 140 },
      { left: "75%", top: "70%", rotate: -5, delay: 9, width: 155 },
      { left: "42%", top: "8%", rotate: 2, delay: 2, width: 130 },
      { left: "55%", top: "80%", rotate: -3, delay: 7, width: 145 },
    ];
  }, [mounted]);

  const orbitTerms = terms.slice(0, 6);
  const headlineTerms1 = terms.slice(0, 10);
  const headlineTerms2 = terms.slice(5, 15);

  const typewriterPhrases = [
    "The Voice of SPX6900",
    "News · Analysis · Culture",
    "Enter the Cognisphere",
    "Where Ideas Become Movements",
    "Beyond the S&P 500",
  ];

  if (!mounted) {
    return <section ref={sectionRef} className="relative h-[70vh] sm:h-[60vh]" />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-24 md:py-28"
      style={{ minHeight: "clamp(420px, 60vh, 700px)" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-mag-black via-[#0d0d0d] to-mag-black" />

      {/* Subtle radial glow center */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)",
          rotate: rotateCenter,
        }}
      />

      {/* ── Floating glossary terms background ── */}
      {floatingStyles.map((style, i) => (
        <FloatingTerm key={i} term={terms[i % terms.length]} style={style} />
      ))}

      {/* ── Headline ticker strips ── */}
      <motion.div style={{ y: parallaxY1 }}>
        <HeadlineStrip words={headlineTerms1} direction={1} speed={45} y="12%" />
        <HeadlineStrip words={headlineTerms2} direction={-1} speed={55} y="88%" />
      </motion.div>

      {/* ── Article fragments (desktop only) ── */}
      {fragmentStyles.map((style, i) => (
        <ArticleFragment
          key={i}
          term={terms[(i * 3) % terms.length]}
          definition={`A foundational concept within the SPX6900 ecosystem and community lore.`}
          style={style}
        />
      ))}

      {/* ── Ink drop ripples ── */}
      <InkDrop delay={0} x="20%" y="30%" size={80} />
      <InkDrop delay={2} x="75%" y="25%" size={60} />
      <InkDrop delay={4} x="50%" y="70%" size={100} />
      <InkDrop delay={6} x="30%" y="75%" size={70} />

      {/* ═══ CENTER CONTENT ═══ */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
        style={{ y: parallaxY2 }}
      >
        {/* Orbiting terms ring (hidden on small mobile) */}
        <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px]">
          {/* Orbit ring visual */}
          <motion.div
            className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full border border-gold-400/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-10 sm:inset-14 md:inset-16 rounded-full border border-dashed border-gold-400/[0.07]"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />

          {/* Orbiting glossary terms */}
          <div className="hidden sm:block">
            {orbitTerms.map((term, i) => (
              <OrbitingTerm
                key={term}
                term={term}
                radius={140 + (i % 2) * 30}
                duration={25 + i * 5}
                startAngle={(360 / orbitTerms.length) * i}
                size={11 + (i % 3) * 2}
              />
            ))}
          </div>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Animated quill icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gold-400 mb-3"
                animate={{ rotate: [0, -3, 3, -1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="m15 5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                The{" "}
                <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
                  Editorial
                </span>
              </h2>
            </motion.div>

            {/* Animated divider */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-3 mb-3"
              initial={{ width: 0 }}
              animate={isInView ? { width: 120 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="h-6"
            >
              <TypewriterCycle
                phrases={typewriterPhrases}
                className="text-sm sm:text-base text-mag-muted font-body"
              />
            </motion.div>
          </div>
        </div>

        {/* Animated stat pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-8 sm:mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {["News", "Articles", "Guides", "Videos", "Glossary"].map((label, i) => (
            <motion.div
              key={label}
              className="px-4 py-1.5 rounded-full border border-gold-400/20 bg-gold-400/[0.04] text-xs sm:text-sm font-display font-semibold text-gold-400/60 tracking-wider uppercase"
              whileHover={{ borderColor: "rgba(212,175,55,0.5)", color: "rgba(212,175,55,0.9)", scale: 1.05 }}
              animate={{
                borderColor: ["rgba(212,175,55,0.15)", "rgba(212,175,55,0.3)", "rgba(212,175,55,0.15)"],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {label}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-mag-black to-transparent pointer-events-none" />
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-mag-black to-transparent pointer-events-none" />
    </section>
  );
}
