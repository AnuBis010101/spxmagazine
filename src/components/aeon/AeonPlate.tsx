"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { platePath } from "@/lib/aeon";

/* ─────────────────────────────────────────────────────────────────────────
   A framed plate: the artwork shown as an object rather than an ornament.

   The crop does real work. aspect-[4/5] alone trims only ~6% off a 513x700
   frame, and the HUD furniture on these artworks sits along the TOP, so the
   inner layer is scaled and biased upward to clear it. A resting overscan
   keeps the matte covered at the corners when the plate tilts.

   The frame owns :hover and the pointer handlers; a separate inner layer is
   what transforms. That split is the documented fix for the card-hover
   flicker reported twice on this codebase.
   ──────────────────────────────────────────────────────────────────────── */

export default function AeonPlate({ id }: { id: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = useState({ x: 0, y: 0, rx: 0, ry: 0 });

  function onMove(e: React.PointerEvent) {
    if (reduce || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ x: px * 10, y: py * 10, rx: -py * 6, ry: px * 6 });
  }

  return (
    <figure className="ap-figure mx-auto w-full max-w-[280px]">
      <div
        ref={frame}
        onPointerMove={onMove}
        onPointerLeave={() => setT({ x: 0, y: 0, rx: 0, ry: 0 })}
        className="ap-frame"
      >
        <div
          className="ap-inner"
          style={{
            transform: `translate3d(${t.x}px, ${t.y}px, 0) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(1.06)`,
          }}
        >
          <Image
            src={platePath(id)}
            alt=""
            width={560}
            height={764}
            className="ap-img"
            sizes="280px"
            priority
          />
        </div>
      </div>

      <figcaption className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-mag-muted md:text-left">
        <Link href="/learn/project-aeon" className="transition-colors hover:text-gold-300">
          Aeon № {id} &middot; Project AEON
        </Link>
      </figcaption>

      <style>{`
        .ap-frame {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          /* a black matte inside a gold rim, the way a plate is mounted */
          padding: 12px;
          background: #050506;
          border: 1px solid color-mix(in oklab, var(--color-gold-400) 42%, transparent);
          box-shadow: 0 34px 70px -40px #000;
          perspective: 900px;
        }
        .ap-inner {
          position: absolute;
          inset: 12px;
          overflow: hidden;
          border-radius: 2px;
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .ap-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* bias upward: the HUD furniture on these frames is along the top */
          object-position: 50% 28%;
          transform: scale(1.33);
          display: block;
        }
        @media (prefers-reduced-motion: reduce) {
          .ap-inner { transition: none; transform: none !important; }
        }
      `}</style>
    </figure>
  );
}
