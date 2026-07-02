/**
 * Motion tokens — one shared vocabulary for easing, duration and spring.
 *
 * Prefer these over inline cubic-beziers and one-off spring configs so timing
 * reads as a designed system rather than per-component guesswork. Framer Motion
 * accepts the bezier tuples directly as `ease` and the spring objects spread
 * into `transition`.
 */

type Bezier = [number, number, number, number];

export const EASE: {
  /** Expo-out: decisive start, long premium settle. Default for entrances. */
  out: Bezier;
  /** Smooth symmetric in-out for looping / positional moves. */
  inOut: Bezier;
  /** Gentle standard curve for small state changes. */
  standard: Bezier;
} = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  standard: [0.25, 0.1, 0.25, 1],
};

/** Durations in seconds. */
export const DUR = {
  fast: 0.25,
  base: 0.5,
  slow: 0.7,
} as const;

/** Reusable spring configs. */
export const SPRING = {
  /** Soft settle for panels, layout shifts. */
  soft: { type: "spring", stiffness: 260, damping: 30 },
  /** Snappy pop for pills, toggles, active indicators. */
  snappy: { type: "spring", stiffness: 400, damping: 30 },
} as const;
