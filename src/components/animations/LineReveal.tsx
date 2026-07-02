"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

interface LineRevealProps {
  /** The headline text. Split on whitespace into masked, rising words. */
  title: string;
  /** Classes applied to the rendered <h1> (sizing, colour, spacing, text-balance). */
  className?: string;
}

/**
 * Line-masked headline reveal for detail-page <h1>s.
 *
 * Each WORD is wrapped in an `inline-block overflow-hidden` mask; an inner
 * span rises from y:110% to 0, staggered so the headline appears to lift line
 * by line from behind a mask. Word-level (not line-level) wrapping is
 * deliberate: the true line count of dynamic, text-balanced text can only be
 * known after measurement, and measuring on the server would mismeasure and
 * flash. Real whitespace text nodes sit between the word wrappers, so
 * `text-balance` and normal wrapping behave exactly as on plain text.
 *
 * Under prefers-reduced-motion the component renders a plain static <h1>:
 * no wrappers, no transforms — just the text.
 *
 * SSR safety: we must NOT branch the DOM structure on useReducedMotion() during
 * the first render — it is null on the server but resolves on the client, which
 * would swap the element tree and trip a hydration mismatch (a headline flash on
 * exactly the reduced-motion users we care about). So the server and first client
 * render always emit the plain <h1>; the word-split reveal is a post-mount
 * enhancement applied only for motion-OK users.
 */
export default function LineReveal({ title, className }: LineRevealProps) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Server + first client render (and reduced-motion always): plain static <h1>.
  // Identical on both sides → no hydration mismatch, never an invisible headline.
  if (!mounted || prefersReduced) {
    return <h1 className={className}>{title}</h1>;
  }

  const words = title.split(/(\s+)/); // keep whitespace tokens as separate nodes

  return (
    <h1 className={className}>
      {/* Screen-reader-friendly single label; the animated words are aria-hidden. */}
      <span className="sr-only">{title}</span>
      <span aria-hidden="true">
        {words.map((token, i) => {
          // Whitespace tokens: render as-is so wrapping/text-balance is natural.
          if (/^\s+$/.test(token)) {
            return <span key={i}>{token}</span>;
          }
          const wordIndex = words.slice(0, i).filter((t) => !/^\s+$/.test(t)).length;
          return (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom"
              style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
            >
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: DUR.slow,
                  ease: EASE.out,
                  delay: wordIndex * 0.08,
                }}
              >
                {token}
              </motion.span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
