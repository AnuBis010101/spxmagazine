"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import GoldParticles from "@/components/animations/GoldParticles";

interface FlippeningCelebrationProps {
  /** The market-cap milestone that was just crossed, e.g. "$10B". */
  label: string;
  onDismiss: () => void;
}

/**
 * A one-shot celebration that fires when the Flippening tier advances: a gold
 * particle shower (reused GoldParticles) + a radial coin burst + a ribbon.
 * Auto-dismisses. prefers-reduced-motion degrades to a static, motion-free
 * badge that is still announced to screen readers (aria-live).
 */
export default function FlippeningCelebration({ label, onDismiss }: FlippeningCelebrationProps) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), reduce ? 6000 : 4500);
    return () => clearTimeout(t);
  }, [reduce]);

  // Radial coin burst, seeded once (kept inside the card, so modest distances).
  const burst = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 26 + (i % 3) * 0.18;
        const dist = 70 + (i % 5) * 26;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 4 + (i % 4) * 2,
          delay: (i % 6) * 0.035,
        };
      }),
    []
  );

  return (
    <AnimatePresence onExitComplete={onDismiss}>
      {show && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Gold wash behind the ribbon */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,175,55,0.16) 0%, transparent 65%)",
            }}
          />

          {!reduce && (
            <>
              {/* Reused ambient shower */}
              <GoldParticles count={22} />

              {/* Radial coin burst from the card centre */}
              <div className="absolute left-1/2 top-1/2">
                {burst.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      background: "radial-gradient(circle, #F0D96E 0%, #D4AF37 70%)",
                      boxShadow: "0 0 6px rgba(212,175,55,0.8)",
                    }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                    animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0.5, 1, 0.4] }}
                    transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Ribbon banner */}
          <motion.div
            className="relative z-10 mx-4 rounded-2xl border border-gold-400/50 bg-mag-black/85 px-6 py-4 text-center shadow-[0_0_40px_rgba(212,175,55,0.35)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 24 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 200, damping: 15 }}
          >
            <p className="font-display text-lg sm:text-xl font-bold bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent">
              🚀 {label} market cap reached
            </p>
            <p className="mt-1 text-xs sm:text-sm text-mag-muted font-body">
              A new Flippening milestone unlocked
            </p>
          </motion.div>

          {/* Dismiss — 44px target, the only interactive element */}
          <button
            type="button"
            onClick={() => setShow(false)}
            aria-label="Dismiss milestone celebration"
            className="pointer-events-auto absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full text-mag-muted hover:text-gold-400 transition-colors"
          >
            <span aria-hidden className="text-xl leading-none">×</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
