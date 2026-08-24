import { cn } from "@/lib/utils/cn";
import AeonMark from "@/components/aeon/AeonMark";
import { aeonFor } from "@/lib/aeon";

/**
 * Art-directed fallback cover for posts with no image.
 *
 * Instead of a flat gray gradient + "SPX" label, each imageless post gets a
 * stable-but-varied editorial plate: a large outlined display monogram over a
 * hash-placed gold radial, inside a hairline frame. The treatment is derived
 * deterministically from `seed` (the slug) so a given post always looks the
 * same, but the wall of covers on a list page reads as designed, not repeated.
 */

// Cheap deterministic string hash (djb2-ish). Stable across renders/SSR.
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Radial-glow anchor points — enough variety that adjacent cards differ.
const GLOW = ["25% 22%", "76% 24%", "28% 78%", "80% 72%", "50% 30%", "18% 55%"];

interface TypographicCoverProps {
  title: string;
  /** Stable seed for the derived treatment — pass the post slug. */
  seed?: string;
  size?: "sm" | "lg";
  /**
   * Replace the gold wash with an Aeon face at the same anchor and weight.
   * Opt-in and deliberately so: this component also backs the home page's
   * featured carousel, the departments grid and video cards, and defaulting it
   * on would change all of those under cover of a listings tweak.
   */
  seal?: boolean;
  className?: string;
}

export default function TypographicCover({
  title,
  seed,
  size = "lg",
  seal = false,
  className,
}: TypographicCoverProps) {
  const h = hash(seed ?? title);
  const initial = (title.trim()[0] ?? "S").toUpperCase();
  const glow = GLOW[h % GLOW.length];
  const rotate = (h % 7) - 3; // -3deg .. +3deg
  const lg = size === "lg";

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden bg-mag-black", className)}
    >
      {/* Hash-placed gold wash. With `seal`, an Aeon occupies the same anchor
          at the same weight: she does not sit on top of the glow, she is the
          glow. The monogram still wins the composition. */}
      {seal ? (
        <div
          className="tc-seal absolute"
          style={{ left: glow.split(" ")[0], top: glow.split(" ")[1] }}
        >
          <AeonMark
            id={aeonFor(seed ?? title, 4)}
            size={lg ? 260 : 96}
            ring={false}
            vignette={false}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at ${glow}, rgba(212,175,55,0.16), transparent 72%)`,
          }}
        />
      )}
      {/* Base tonal fade so the plate never reads as pure black */}
      <div className="absolute inset-0 bg-gradient-to-br from-mag-dark/60 via-transparent to-mag-black" />

      {/* Giant outlined monogram */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 select-none font-display font-bold leading-none text-transparent"
        style={{
          fontSize: lg ? "12rem" : "4.25rem",
          WebkitTextStroke: `${lg ? 1.5 : 1}px rgba(212,175,55,0.30)`,
          transform: `translate(-50%,-50%) rotate(${rotate}deg)`,
        }}
      >
        {initial}
      </span>

      {/* Hairline frame */}
      <div
        className={cn(
          "absolute rounded-lg border border-gold-400/15",
          lg ? "inset-3" : "inset-1.5",
        )}
      />

      {lg && (
        <span className="absolute bottom-3 left-4 font-display text-[11px] font-bold uppercase tracking-[0.3em] text-gold-400/60">
          SPX&middot;MAG
        </span>
      )}

      {seal && (
        <style>{`
          /* Centred on the same anchor the wash used, so the composition does
             not move. The radial mask means she has no edge anywhere - she
             dissolves into the plate rather than sitting on it. */
          .tc-seal {
            transform: translate(-50%, -50%);
            opacity: 0.10;
            -webkit-mask-image: radial-gradient(circle at 50% 42%, #000 38%, transparent 72%);
            mask-image: radial-gradient(circle at 50% 42%, #000 38%, transparent 72%);
            transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          /* The group is ArticleCard's own <Link>; the seal is a descendant, so
             the hover target never moves and the tilt-flicker pattern cannot
             recur here. */
          .group:hover .tc-seal {
            opacity: 0.22;
            transform: translate(-50%, -50%) scale(1.05);
          }
          @media (prefers-reduced-motion: reduce) {
            .tc-seal { transition: none; }
            .group:hover .tc-seal { transform: translate(-50%, -50%); }
          }
        `}</style>
      )}
    </div>
  );
}
