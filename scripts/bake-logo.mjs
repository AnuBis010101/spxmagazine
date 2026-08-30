#!/usr/bin/env node
/*
 * Bake the magazine wordmark into the canvas geometry the site already assumes.
 *
 * WHY THIS EXISTS
 * The uploaded artwork (logomagazine.png, repo root) is a 946x2048 portrait
 * canvas whose actual wordmark occupies only 782x445 — about 22% of the canvas
 * height, the rest transparent padding. The logo it replaces
 * (public/spxlogo-light.png) is a 2134x2134 SQUARE canvas whose wordmark fills
 * 2091x1172 — about 55% of the height.
 *
 * Every place the site renders the logo depends on that geometry:
 *   - Header / Footer / MobileNav size it by HEIGHT with w-auto, so the rendered
 *     width — and the wordmark's share of it — follows the canvas aspect ratio.
 *   - AnimatedHero, Preloader, AdminSidebar and the admin login page place it in
 *     a fixed SQUARE box (w-[120px] h-[120px] and friends). A non-square canvas
 *     either letterboxes (object-contain) or distorts (no object-fit).
 *   - Header's .brand-sweep masks the hover specular with the logo itself at
 *     mask-size:contain / mask-position:center over the image's own box, so the
 *     mask only lines up with the glyphs if the canvas ratio is unchanged.
 *
 * Dropping the raw portrait file in would have rendered the wordmark roughly
 * 2.6x smaller in the header and misaligned the sweep. So instead of touching
 * ~8 call sites with hand-tuned sizes, we normalise the ASSET: same square
 * canvas, same wordmark-height-to-canvas ratio. Every existing size prop then
 * keeps working untouched, and the logo renders at exactly the size it did.
 *
 * We deliberately do NOT upscale. The reference ratios are taken from the old
 * asset, but the canvas is built around the new artwork at its native 782x445,
 * which is still far larger than the biggest place it renders (a 120px box, so
 * 360px at 3x DPR). Upscaling to the old 2134px canvas would only soften the
 * mark and inflate the file.
 *
 * Usage: node scripts/bake-logo.mjs [--check]
 *   --check  verify the built asset matches the reference geometry, write nothing
 */
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SRC = join(ROOT, "logomagazine.png");
const OUT = join(ROOT, "public", "logomagazine.png");

/* The size contract, measured from the logo this replaced
   (public/spxlogo-light.png): a 2134x2134 canvas whose wordmark occupied
   2091x1172, so the mark stood 1172/2134 of the canvas tall. Every call site
   sizes the logo by that canvas, so reproducing this fraction is what keeps the
   mark rendering at the size the layout was built around.

   Hard-coded rather than re-measured from the old file so this script keeps
   working if that asset is ever deleted; REF_FILE is used only to re-derive the
   number when it happens to still be present. */
const REF_FILL_H = 1172 / 2134; // 0.54920
const REF_FILE = join(ROOT, "public", "spxlogo-light.png");

/** Opaque bounding box of the artwork inside its canvas. */
async function geometry(file) {
  const meta = await sharp(file).metadata();
  const { info } = await sharp(file)
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  return {
    canvasW: meta.width,
    canvasH: meta.height,
    contentW: info.width,
    contentH: info.height,
    // Fraction of the canvas the artwork occupies — the invariant we preserve.
    fillH: info.height / meta.height,
    fillW: info.width / meta.width,
    ratio: info.width / info.height,
  };
}

const check = process.argv.includes("--check");

if (!existsSync(SRC)) {
  console.error(`Missing source artwork: ${SRC}`);
  process.exit(1);
}

/* PNG encoding options for the shipped asset — see the note at the composite
   step for why this is palette-quantised. */
const ENCODE = { compressionLevel: 9, palette: true, colours: 128 };

/* Prefer a live measurement of the old asset when it is still around — it keeps
   the constant honest — but fall back to it when it is not. */
let ref = { fillH: REF_FILL_H, canvasW: 2134, canvasH: 2134, contentW: 2091, contentH: 1172, ratio: 2091 / 1172 };
if (existsSync(REF_FILE)) {
  const measured = await geometry(REF_FILE);
  if (Math.abs(measured.fillH - REF_FILL_H) > 0.001) {
    console.error(
      `REF_FILL_H (${REF_FILL_H.toFixed(5)}) no longer matches ` +
        `${REF_FILE.replace(ROOT + "/", "")} (${measured.fillH.toFixed(5)}). ` +
        `Update the constant deliberately — it is the size contract.`
    );
    process.exit(1);
  }
  ref = measured;
}

/* Quantisation snaps the artwork's faintest antialiased fringe to fully
   transparent, which shrinks its opaque bounding box by a few pixels. Measuring
   the source before encoding would therefore size the canvas against an extent
   the shipped file does not actually have, and the wordmark would land ~1.3%
   small. So trim, encode exactly as we will ship it, and re-trim: `art` is the
   artwork as it will really appear, and every number below derives from that. */
const encoded = await sharp(SRC).trim({ threshold: 1 }).png(ENCODE).toBuffer();
const artwork = await sharp(encoded).trim({ threshold: 1 }).png().toBuffer();
const art = await sharp(artwork).metadata();

const srcMeta = await sharp(SRC).metadata();
const src = {
  canvasW: srcMeta.width,
  canvasH: srcMeta.height,
  contentW: art.width,
  contentH: art.height,
  fillH: art.height / srcMeta.height,
  ratio: art.width / art.height,
};

// The invariant: the wordmark must occupy the same fraction of a square canvas
// as the old one did, so height-constrained call sites render it identically.
const canvas = Math.round(src.contentH / ref.fillH);
const left = Math.round((canvas - src.contentW) / 2);
const top = Math.round((canvas - src.contentH) / 2);

if (left < 0 || top < 0) {
  console.error(
    `Artwork ${src.contentW}x${src.contentH} does not fit a ${canvas}px canvas ` +
      `at the reference fill ratio ${ref.fillH.toFixed(5)}.`
  );
  process.exit(1);
}

console.log(
  `reference  ${existsSync(REF_FILE) ? REF_FILE.replace(ROOT + "/", "") : "REF_FILL_H constant"}`
);
console.log(
  `  canvas ${ref.canvasW}x${ref.canvasH}  content ${ref.contentW}x${ref.contentH}` +
    `  fillH ${ref.fillH.toFixed(5)}  ratio ${ref.ratio.toFixed(4)}`
);
console.log(`source     ${SRC.replace(ROOT + "/", "")}`);
console.log(
  `  canvas ${src.canvasW}x${src.canvasH}  content ${src.contentW}x${src.contentH}` +
    `  fillH ${src.fillH.toFixed(5)}  ratio ${src.ratio.toFixed(4)}`
);
console.log(`target     ${canvas}x${canvas} square, artwork at (${left}, ${top}), no upscale`);

if (!check) {
  await sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: artwork, left, top }])
    /* Palette-quantised. The artwork is a grunge-textured wordmark, and that
       per-pixel noise defeats PNG's filters — stored truecolour it lands at
       188KB against the 51KB logo it replaces, and this file is fetched raw on
       every page (the <link rel=preload>, the header's mask-image, and the
       preloader's plain <img> all bypass next/image). At 128 colours it is
       43KB, and rendered at the sizes the site actually uses — a 120px box at
       most — it is indistinguishable from truecolour; compared side by side at
       4x magnification the texture and the gold lettering are unchanged. */
    .png({ compressionLevel: 9, palette: true, colours: 128 })
    .toFile(OUT);
}

// Verify what actually landed on disk, rather than trusting the arithmetic.
const out = await geometry(OUT);
const drift = Math.abs(out.fillH - ref.fillH);
console.log(`built      ${OUT.replace(ROOT + "/", "")}`);
console.log(
  `  canvas ${out.canvasW}x${out.canvasH}  content ${out.contentW}x${out.contentH}` +
    `  fillH ${out.fillH.toFixed(5)}  ratio ${out.ratio.toFixed(4)}`
);

const problems = [];
if (out.canvasW !== out.canvasH) problems.push("canvas is not square");
if (drift > 0.0015) {
  problems.push(
    `wordmark height fill drifted ${drift.toFixed(5)} from the reference ` +
      `(${out.fillH.toFixed(5)} vs ${ref.fillH.toFixed(5)})`
  );
}
if (Math.abs(out.ratio - src.ratio) > 0.005) {
  problems.push(`artwork aspect ratio distorted (${out.ratio.toFixed(4)} vs ${src.ratio.toFixed(4)})`);
}
if (out.contentW < src.contentW || out.contentH < src.contentH) {
  problems.push("artwork was downscaled");
}

if (problems.length) {
  console.error("\nFAILED:\n  " + problems.join("\n  "));
  process.exit(1);
}

// What this means where it actually renders: the header box is 50px tall.
const px = (fill, box) => (fill * box).toFixed(2);
console.log(
  `\nOK — in a 50px-tall square box the wordmark is ${px(out.fillH, 50)}px tall ` +
    `(was ${px(ref.fillH, 50)}px).`
);
