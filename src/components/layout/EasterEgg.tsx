"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Coin = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
};

const SEQUENCE = "spx6900";

/**
 * Type "spx6900" anywhere (outside a text field) to rain gold coins.
 * Honors prefers-reduced-motion with a static badge instead of the rain.
 */
export default function EasterEgg() {
  const reduce = useReducedMotion();
  const [coins, setCoins] = useState<Coin[] | null>(null);
  const [badge, setBadge] = useState(false);

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-SEQUENCE.length);
      }
      if (buffer === SEQUENCE) {
        buffer = "";
        if (reduce) {
          setBadge(true);
          return;
        }
        // Math.random()/Date.now() here run in an event handler, not render.
        setCoins(
          Array.from({ length: 42 }, (_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 100,
            delay: Math.random() * 0.9,
            duration: 2.2 + Math.random() * 1.8,
            size: 20 + Math.random() * 24,
            rotate: Math.random() * 720 - 360,
          }))
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduce]);

  useEffect(() => {
    if (!coins) return;
    const t = setTimeout(() => setCoins(null), 5000);
    return () => clearTimeout(t);
  }, [coins]);

  useEffect(() => {
    if (!badge) return;
    const t = setTimeout(() => setBadge(false), 2200);
    return () => clearTimeout(t);
  }, [badge]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {coins &&
          coins.map((c) => (
            <motion.span
              key={c.id}
              className="absolute top-0 select-none"
              style={{ left: `${c.left}vw`, fontSize: c.size }}
              initial={{ y: "-12vh", rotate: 0, opacity: 0 }}
              animate={{ y: "112vh", rotate: c.rotate, opacity: [0, 1, 1, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: c.duration, delay: c.delay, ease: "easeIn" }}
            >
              🪙
            </motion.span>
          ))}
      </AnimatePresence>

      <AnimatePresence>
        {badge && (
          <motion.div
            key="egg-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/40 bg-mag-black/90 px-6 py-3 font-display text-lg font-bold text-gold-400"
          >
            6900 · higher 📈
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
