/**
 * Bakes the Aeon artwork into the two asset families the site uses.
 *
 * Why bake rather than treat in CSS: a runtime `filter` rasterises its whole
 * subtree, so six treated marks on a listing page means six filtered
 * compositing layers — the exact class of scroll cost this codebase already
 * documents. Baked, the browser just draws an image.
 *
 *   marks  256x256  a square face crop, for medallions and seals
 *   plates 720x982  the full frame, where a whole rectangle is legitimate
 *
 * Run once and commit the output:  node scripts/bake-aeon.mjs
 */
import sharp from "sharp";
import { mkdirSync, readdirSync } from "fs";
import { join } from "path";

const SRC = "public/aeon";
const OUT_MARK = "public/aeon/mark";
const OUT_PLATE = "public/aeon/plate";

/* Crop geometry. Source frames are 513x700 and the characters' heads sit at
   ~47% of frame height — measured, not guessed: a crop centred at 38% keeps
   too much headroom and pushes the chin toward the edge. The 330px window is
   the baked equivalent of object-fit:cover plus scale(1.55); without that zoom
   the busy background floods back into the circle. */
const FACE_X = 0.50;
const FACE_Y = 0.47;
const WINDOW = 330;

/** True duotone: map luminance onto a shadow→highlight ramp, per channel. */
const SHADOW = [10, 10, 11];        // #0a0a0b, the page ground
const HIGHLIGHT = [240, 217, 138];  // #F0D98A, gold at the top end
/* True duotone: map luminance onto a shadow->highlight ramp.

   Done with recomb + linear rather than grayscale + linear, because grayscale
   collapses the image to a single band and sharp refuses to expand bands back
   out inside linear(). recomb is a 3x3 matrix over RGB, so it stays 3-band:
   each output channel becomes luma scaled by that channel's ramp length, and
   linear() then lifts the whole thing by the shadow colour. */
const LUMA = [0.2126, 0.7152, 0.0722];
const duotone = (img) =>
  img
    .recomb(
      HIGHLIGHT.map((hi, i) => {
        const k = (hi - SHADOW[i]) / 255;
        return LUMA.map((l) => k * l);
      }),
    )
    // both args must be arrays of equal length; a scalar `a` is rejected.
    .linear([1, 1, 1], SHADOW);

/* Light touch, and this is what ships.

   The duotone above was built first and rejected on the evidence: rendered at
   the sizes actually used, a gold ramp turns these faces muddy olive, and by
   60px they are indistinct. The artwork carries its charm in the faces, and a
   full tone map throws that away. Pulling the colour back instead keeps them
   readable while the gold ring, the vignette and the page around them do the
   reconciling. `--duotone` re-bakes the rejected variant if you want to look
   again. */
const softened = (img) => img.modulate({ saturation: 0.62 }).linear(1.06, -8);

const TREATMENTS = { duotone, soft: softened };

/* Only the curated pool is baked. src/lib/aeon.ts never picks outside it, so
   baking all 24 just puts files in the repo that nothing can request. Widen
   this if the pool widens. */
const POOL = [
  // the curated eight — used at medallion size across the site
  3, 7, 9, 11, 15, 16, 17, 21,
  // widened for the orbit background only, where marks are 28-48px and faint:
  // frames passed over above for being darker or busier still read fine there
  1, 5, 6, 10, 12, 13, 14, 18, 20,
];

function sources() {
  return readdirSync(SRC)
    .filter((f) => /^aeon-\d+\.jpg$/.test(f))
    .map((f) => ({ n: Number(f.match(/\d+/)[0]), file: join(SRC, f) }))
    .filter(({ n }) => POOL.includes(n))
    .sort((a, b) => a.n - b.n);
}

async function bake({ variantsForMarks, plateVariant }) {
  mkdirSync(OUT_MARK, { recursive: true });
  mkdirSync(OUT_PLATE, { recursive: true });

  for (const { n, file } of sources()) {
    const meta = await sharp(file).metadata();
    const left = Math.max(0, Math.round(meta.width * FACE_X - WINDOW / 2));
    const top = Math.max(0, Math.round(meta.height * FACE_Y - WINDOW / 2));
    const w = Math.min(WINDOW, meta.width - left);
    const h = Math.min(WINDOW, meta.height - top);

    for (const v of variantsForMarks) {
      const suffix = variantsForMarks.length > 1 ? `-${v}` : "";
      await TREATMENTS[v](sharp(file).extract({ left, top, width: w, height: h }).resize(256, 256))
        .webp({ quality: 82 })
        .toFile(join(OUT_MARK, `aeon-${n}${suffix}.webp`));
    }

    if (plateVariant) {
      await TREATMENTS[plateVariant](sharp(file).resize(720, 982, { fit: "cover" }))
        .webp({ quality: 80 })
        .toFile(join(OUT_PLATE, `aeon-${n}.webp`));
    }
  }
}

const args = process.argv.slice(2);
if (args.includes("--compare")) {
  await bake({ variantsForMarks: ["duotone", "soft"], plateVariant: null });
  console.log("baked BOTH mark variants for comparison");
} else {
  const v = args.includes("--duotone") ? "duotone" : "soft";
  await bake({ variantsForMarks: [v], plateVariant: v });
  console.log(`baked marks + plates (${v})`);
}
