/**
 * The Aeon artwork, as a design material.
 *
 * Assets are baked by `scripts/bake-aeon.mjs` into two families:
 *   /aeon/mark/aeon-N.webp   256x256 face crop, colour pulled back
 *   /aeon/plate/aeon-N.webp  720x982 full frame, same treatment
 *
 * Nothing here applies a runtime filter. The treatment is already in the
 * pixels, so a mark costs the browser exactly one image draw.
 */

/**
 * Curated pool. The 24 artworks are not interchangeable: several carry meme
 * graphics burned onto the character (pixel sunglasses, banknote fans) that no
 * crop can remove, and several more are dark enough that the face disappears
 * once the vignette lands. These eight hold up at medallion size.
 */
export const AEON_POOL = [3, 7, 9, 11, 15, 16, 17, 21] as const;

/**
 * The reference frame — a single clear subject on open ground. Used wherever
 * one fixed artwork beats a rotating one: a surface a reader returns to should
 * look the same each time rather than reshuffling.
 */
export const AEON_REFERENCE = 17;

/** Cheap deterministic hash (djb2-ish), matching TypographicCover's. Stable across SSR. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Pick a frame from a seed. Deterministic, so server and client agree and a
 * given post keeps its face across navigations.
 *
 * `span` narrows the pool: a wall of twelve cards pulling from four files
 * reads as texture and keeps the cache small, where twelve different faces
 * reads as a gallery.
 */
export function aeonFor(seed: string, span: number = AEON_POOL.length): number {
  const pool = AEON_POOL.slice(0, Math.max(1, Math.min(span, AEON_POOL.length)));
  return pool[hash(seed) % pool.length];
}

/**
 * A wider pool, for the orbit background only.
 *
 * AEON_POOL above is the set that holds up as a large medallion. Out in the
 * orbit the marks are 28-48px and sit behind content, so frames passed over
 * there for being darker or busier still read perfectly well — and the extra
 * frames are what let each route show a different cast.
 */
export const AEON_ORBIT_POOL = [
  3, 7, 9, 11, 15, 16, 17, 21, 1, 5, 6, 10, 12, 13, 14, 18, 20,
] as const;

/**
 * Deterministically pick `count` distinct frames for a route.
 *
 * Rotating the start point by a hash of the path gives every page its own
 * cast while keeping a given page stable across renders and navigations —
 * the marks must not reshuffle underneath a reader who scrolls back up.
 */
export function aeonOrbitSet(seed: string, count: number): number[] {
  const pool = AEON_ORBIT_POOL;
  const start = hash(seed) % pool.length;
  const step = 1 + (hash(seed + "step") % (pool.length - 1));
  const out: number[] = [];
  const taken = new Set<number>();
  let i = 0;
  // walk the pool with a hash-chosen stride until `count` distinct frames
  while (out.length < Math.min(count, pool.length) && i < pool.length * 4) {
    const id = pool[(start + i * step) % pool.length];
    if (!taken.has(id)) {
      taken.add(id);
      out.push(id);
    }
    i++;
  }
  return out;
}

export const markSrc = (id: number) => `/aeon/mark/aeon-${id}.webp`;
export const platePath = (id: number) => `/aeon/plate/aeon-${id}.webp`;
