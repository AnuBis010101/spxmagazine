"use client";

import { useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useReactions } from "@/hooks/useReactions";
import { cn } from "@/lib/utils/cn";

interface ReactionBarProps {
  slug: string;
  initialReactions?: Record<string, number>;
}

const REACTIONS = [
  { type: "fire", emoji: "\uD83D\uDD25", label: "Fire" },
  { type: "mindblown", emoji: "\uD83E\uDD2F", label: "Mind Blown" },
  { type: "clap", emoji: "\uD83D\uDC4F", label: "Clap" },
  { type: "rocket", emoji: "\uD83D\uDE80", label: "Rocket" },
] as const;

/* Odometer digit: a vertical 0-9 strip translated to show the active digit.
   Rolls to the new digit when `value` changes. Reduced motion = static. */
function OdometerDigit({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return (
    <span
      className="relative inline-block overflow-hidden tabular-nums"
      style={{ height: "1em", lineHeight: "1em" }}
      aria-hidden="true"
    >
      {/* Invisible spacer reserves the glyph width (all digits share it). */}
      <span className="invisible">0</span>
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: reduce ? `${-value}em` : `${-value}em` }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} style={{ height: "1em", lineHeight: "1em" }}>
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/* Odometer number: renders each decimal digit as a rolling column.
   The visible digits are aria-hidden; the wrapper carries the real value
   for assistive tech. */
function OdometerNumber({ value }: { value: number }) {
  const digits = String(value).split("");
  return (
    <span className="tabular-nums inline-flex" aria-label={String(value)}>
      {digits.map((ch, i) => (
        <OdometerDigit key={i} value={Number(ch)} />
      ))}
    </span>
  );
}

/* Small gold particle that flies outward and fades */
function Particle({ index }: { index: number }) {
  // Seed the trajectory once per mount so it doesn't re-randomise (and jump)
  // on re-render — keeps the burst pure.
  const { x, y } = useMemo(() => {
    const angle = (index * 120 + Math.random() * 40 - 20) * (Math.PI / 180);
    const distance = 20 + Math.random() * 16;
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  }, [index]);

  return (
    <motion.span
      className="absolute w-1.5 h-1.5 rounded-full bg-gold-400 pointer-events-none"
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x, y, scale: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  );
}

export default function ReactionBar({
  slug,
  initialReactions = {},
}: ReactionBarProps) {
  const { userReaction, react } = useReactions(slug);
  const burstKeyRef = useRef(0);

  const handleClick = useCallback(
    (type: string) => {
      burstKeyRef.current += 1;
      react(type);
    },
    [react],
  );

  return (
    <div className="flex items-center gap-3 rounded-xl bg-mag-dark/80 backdrop-blur-md border border-mag-border/50 px-4 py-3">
      {REACTIONS.map(({ type, emoji, label }) => {
        const count = initialReactions[type] ?? 0;
        const isActive = userReaction === type;
        const total = count + (isActive ? 1 : 0);

        return (
          <motion.button
            key={type}
            type="button"
            onClick={() => handleClick(type)}
            whileTap={{ scale: 0.9 }}
            animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
              isActive
                ? "border border-gold-400 bg-gold-400/10 text-white"
                : "border border-transparent text-mag-muted hover:text-white hover:bg-white/5",
            )}
            aria-label={label}
            title={label}
          >
            <span className="text-base">{emoji}</span>
            {total > 0 && <OdometerNumber value={total} />}

            {/* Particle burst on activation */}
            <AnimatePresence>
              {isActive && (
                <span
                  key={burstKeyRef.current}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  {[0, 1, 2].map((i) => (
                    <Particle key={i} index={i} />
                  ))}
                </span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
