"use client";

import Image from "next/image";
import Link from "next/link";
import { platePath, AEON_REFERENCE } from "@/lib/aeon";

/* ─────────────────────────────────────────────────────────────────────────
   The card you find after the last Editors' Pick.

   A full uncropped artwork is legitimate here because the slot already frames
   it: the carousel gives every card an aspect-[3/4] well with a scrim and a
   badge, and the source is 513x700 (0.733) against the slot's 0.750, so only
   a few pixels trim off each end.

   The frame is hardcoded rather than hashed. Duotone-style treatment fixes a
   colour clash; it does not fix a cluttered composition, and only some frames
   are a single clear subject on open ground.

   Rendered as a plain card, deliberately not this file's local TiltCard: that
   puts onMouseMove and rotateX on the same element, which is the hover-flicker
   pattern already reported twice on this codebase's cards.
   ──────────────────────────────────────────────────────────────────────── */

export default function AeonPlateCard() {
  return (
    <Link
      href="/learn/project-aeon"
      className="apc group relative block flex-shrink-0 w-[320px] sm:w-[360px] overflow-hidden rounded-xl border border-mag-border bg-mag-dark transition-colors hover:border-gold-400/40"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={platePath(AEON_REFERENCE)}
          alt=""
          fill
          className="apc-img object-cover"
          sizes="360px"
        />
        {/* Same scrim the story cards carry, so it sits in the row rather than on it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-mag-black via-mag-black/20 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-gold-400 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-mag-black">
          Collection
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-xl font-bold leading-tight text-white">
            Project AEON
          </h3>
          <p className="mt-1 text-sm text-mag-muted">
            3,333 beings, one quantum glitch
          </p>
        </div>
      </div>

      <style>{`
        .apc-img { transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .apc:hover .apc-img { transform: scale(1.04); }
        @media (prefers-reduced-motion: reduce) {
          .apc-img { transition: none; }
          .apc:hover .apc-img { transform: none; }
        }
      `}</style>
    </Link>
  );
}
