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

export const markSrc = (id: number) => `/aeon/mark/aeon-${id}.webp`;
export const platePath = (id: number) => `/aeon/plate/aeon-${id}.webp`;
