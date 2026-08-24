import Image from "next/image";
import { markSrc } from "@/lib/aeon";

/* ─────────────────────────────────────────────────────────────────────────
   A single Aeon face, treated and framed.

   The whole point of this component is that it is cheap. The colour work is
   baked into the asset, so there is no runtime filter and therefore no
   filtered compositing layer — which is what lets a listing page carry
   several of these without touching scroll cost. Softness comes from a
   gradient sibling, which is free per frame.

   It is decorative in every current use, so it carries alt="" and
   aria-hidden: a reader on a screen reader gains nothing from "anime portrait"
   punctuating a list of headlines.
   ──────────────────────────────────────────────────────────────────────── */

type Props = {
  /** Frame id from the curated pool. */
  id: number;
  /** Rendered diameter in px. The asset is 256, so anything up to ~128 is crisp at 2x. */
  size: number;
  /** Hairline ring, in the gold the rest of the site uses. */
  ring?: boolean;
  /** Resting opacity. Low values are for texture rather than subject. */
  opacity?: number;
  /** Sink the edges into the page so the crop never shows a hard rim. */
  vignette?: boolean;
  className?: string;
};

export default function AeonMark({
  id,
  size,
  ring = true,
  opacity = 1,
  vignette = true,
  className = "",
}: Props) {
  return (
    <span
      aria-hidden
      className={`am-root ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        // Inline, not in the style block below: an inline-block sits in a line
        // box and inherits its descender, which made every wrapper taller than
        // the mark. Layout-critical, so it does not ride on CSS resolution.
        display: "block",
        lineHeight: 0,
      }}
    >
      <Image
        src={markSrc(id)}
        alt=""
        // 2x the display size keeps it crisp without shipping the full 256 twice.
        width={size * 2}
        height={size * 2}
        className="am-img"
        sizes={`${size}px`}
      />
      {vignette && <span className="am-vignette" />}
      {ring && <span className="am-ring" />}

      <style>{`
        .am-root {
          position: relative;
          border-radius: 9999px;
          overflow: hidden;
          flex: none;
          isolation: isolate;
        }
        .am-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Edges fall away into the page ground rather than stopping at a circle. */
        .am-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            72% 72% at 50% 34%,
            transparent 48%,
            color-mix(in oklab, var(--color-mag-black) 72%, transparent) 100%
          );
        }
        .am-ring {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 9999px;
          border: 1px solid color-mix(in oklab, var(--color-gold-400) 45%, transparent);
          box-shadow: inset 0 -8px 16px -12px color-mix(in oklab, var(--color-gold-400) 80%, transparent);
        }
      `}</style>
    </span>
  );
}
