"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/* Shared building blocks for the premium desktop nav.
   Used by Header (plain items) and NavDropdown (trigger) so the active pill
   can spring between them via a single layoutId, and every label shares the
   same per-letter cascade. All motion is transform/opacity only. */

export type NavTone = "active" | "bright" | "muted";

/** Per-letter label: on hover each glyph does a quick 3D flip, cascading
    left-to-right like a split-flap departure board. */
export function NavLetters({
  label,
  hovered,
  tone,
}: {
  label: string;
  hovered: boolean;
  tone: NavTone;
}) {
  return (
    <motion.span
      className="relative z-10 flex"
      style={{ perspective: 500 }}
      initial={false}
      animate={hovered ? "hover" : "rest"}
      variants={{ hover: { transition: { staggerChildren: 0.024 } }, rest: {} }}
      aria-hidden
    >
      {label.split("").map((ch, i) => (
        <motion.span
          key={i}
          className={cn(
            "inline-block font-display text-sm font-medium transition-colors duration-200",
            tone === "active"
              ? "text-gold-400"
              : tone === "bright"
                ? "text-white"
                : "text-mag-muted"
          )}
          style={{ transformOrigin: "50% 100%", backfaceVisibility: "hidden" }}
          variants={{
            rest: { rotateX: 0, y: 0 },
            hover: {
              rotateX: [0, -80, 0],
              y: [0, 2, 0],
              transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] },
            },
          }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** The active-item pill. One instance is rendered by whichever nav item is
    active; the shared layoutId makes it glide between items on route change. */
export function NavActivePill() {
  return (
    <motion.span
      layoutId="navActivePill"
      aria-hidden
      className="absolute inset-0 rounded-full border border-gold-400/30 bg-gradient-to-b from-gold-400/15 to-gold-400/5"
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
    >
      {/* top light-catch + bottom gold glint */}
      <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <span className="nav-pill-glint absolute inset-x-4 bottom-1 h-px" />
    </motion.span>
  );
}

/** Specular shine that sweeps across an item once per hover.
    Parent must carry the `premium-nav-item` class. */
export function NavShine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
    >
      <span className="nav-shine absolute inset-y-0 left-0 w-1/2" />
    </span>
  );
}

/** All CSS for the premium nav (rim, spotlight, shine, hairline, panel).
    Rendered once by the Header. Colors derive from theme tokens via color-mix
    so light mode keeps its warmer gold. */
export function PremiumNavStyles() {
  return (
    <style>{`
      /* Living gradient rim around the nav rail (1px ring via mask) */
      .nav-rim {
        position: absolute; inset: 0; border-radius: 9999px; padding: 1px;
        background: linear-gradient(115deg,
          color-mix(in oklab, var(--color-gold-400) 45%, transparent),
          color-mix(in oklab, var(--color-mag-white) 8%, transparent) 28%,
          color-mix(in oklab, var(--color-gold-400) 18%, transparent) 50%,
          color-mix(in oklab, var(--color-mag-white) 7%, transparent) 72%,
          color-mix(in oklab, var(--color-gold-400) 45%, transparent));
        background-size: 220% 100%;
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        animation: navRim 14s ease-in-out infinite alternate;
      }
      /* Cursor spotlight inside the rail */
      .nav-spot {
        background: radial-gradient(circle,
          color-mix(in oklab, var(--color-gold-400) 22%, transparent),
          transparent 65%);
      }
      /* Specular sweep on item hover */
      .nav-shine {
        transform: translateX(-180%) skewX(-18deg);
        background: linear-gradient(105deg,
          transparent 25%,
          color-mix(in oklab, var(--color-gold-100) 12%, transparent) 45%,
          color-mix(in oklab, var(--color-gold-300) 26%, transparent) 50%,
          color-mix(in oklab, var(--color-gold-100) 12%, transparent) 55%,
          transparent 75%);
      }
      .premium-nav-item:hover .nav-shine {
        animation: navShine 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      /* Breathing glint on the active pill's bottom edge */
      .nav-pill-glint {
        background: linear-gradient(90deg, transparent,
          var(--color-gold-400) 35%,
          color-mix(in oklab, var(--color-gold-100) 90%, transparent) 50%,
          var(--color-gold-400) 65%, transparent);
        background-size: 200% 100%;
        animation: navGlint 3.2s ease-in-out infinite;
        box-shadow: 0 0 10px color-mix(in oklab, var(--color-gold-400) 55%, transparent);
      }
      /* Sweeping hairline under the whole header */
      .nav-hairline-glint {
        background: linear-gradient(90deg, transparent,
          color-mix(in oklab, var(--color-gold-400) 70%, transparent) 35%,
          color-mix(in oklab, var(--color-gold-100) 90%, transparent) 50%,
          color-mix(in oklab, var(--color-gold-400) 70%, transparent) 65%,
          transparent);
        animation: navHairline 8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
      }
      /* Dropdown panel gradient rim */
      .nav-panel-rim {
        background: linear-gradient(180deg,
          color-mix(in oklab, var(--color-gold-400) 45%, transparent),
          color-mix(in oklab, var(--color-gold-400) 12%, transparent) 40%,
          color-mix(in oklab, var(--color-mag-white) 6%, transparent));
      }

      @keyframes navRim { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
      @keyframes navShine { to { transform: translateX(320%) skewX(-18deg); } }
      @keyframes navGlint { 0%, 100% { background-position: 0% 50%; opacity: 0.75; } 50% { background-position: 100% 50%; opacity: 1; } }
      @keyframes navHairline { 0% { transform: translateX(-110%); } 60%, 100% { transform: translateX(410%); } }

      @media (prefers-reduced-motion: reduce) {
        .nav-rim, .nav-pill-glint, .nav-hairline-glint { animation: none !important; }
        .premium-nav-item:hover .nav-shine { animation: none !important; }
      }
    `}</style>
  );
}
