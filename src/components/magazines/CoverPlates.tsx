"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { platePath } from "@/lib/aeon";

/* ─────────────────────────────────────────────────────────────────────────
   Cover studies.

   The one place on the site where the artwork is the content rather than an
   ornament: a magazine cover IS a rectangle, so nothing has to be disguised.

   Called studies, not issues, on purpose. The page above this says the print
   edition does not exist yet; three finished covers labelled "Issue 01"
   underneath that would invent a product. Work in progress is credible where
   a finished product would be a lie. The cover lines are sections the site
   actually runs.

   A closed print run fans open as you descend. Transform and opacity only,
   one scroll subscription, and reduced motion renders the fanned end state
   with nothing subscribed.
   ──────────────────────────────────────────────────────────────────────── */

const STUDIES = [
  { id: 9, no: "01", lines: ["The Cognisphere Weekly", "Project AEON", "Stop trading"] },
  { id: 21, no: "02", lines: ["Community Articles", "On belief", "The flippening"] },
  { id: 17, no: "03", lines: ["Persist Forever", "In their own words", "There is no chart"] },
];

export default function CoverPlates() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // The outer plates swing out from behind the centre one.
  const xL = useTransform(scrollYProgress, [0, 1], ["-6%", "-34%"]);
  const rL = useTransform(scrollYProgress, [0, 1], [0, -7]);
  const xR = useTransform(scrollYProgress, [0, 1], ["6%", "34%"]);
  const rR = useTransform(scrollYProgress, [0, 1], [0, 7]);
  const yC = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);
  const fade = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

  const anim = reduce
    ? [
        { x: "-34%", rotate: -7, y: "0%", opacity: 1 },
        { x: "0%", rotate: 0, y: "-2%", opacity: 1 },
        { x: "34%", rotate: 7, y: "0%", opacity: 1 },
      ]
    : [
        { x: xL, rotate: rL, y: "0%", opacity: fade },
        { x: "0%", rotate: 0, y: yC, opacity: 1 },
        { x: xR, rotate: rR, y: "0%", opacity: fade },
      ];

  return (
    <section ref={ref} className="cp-section">
      <div className="cp-stage">
        <div className="cp-deck">
          {STUDIES.map((s, i) => (
            <motion.figure
              key={s.id}
              className="cp-plate"
              style={{ ...anim[i], zIndex: i === 1 ? 3 : 1 }}
            >
              <Image
                src={platePath(s.id)}
                alt=""
                width={520}
                height={710}
                className="cp-img"
                sizes="260px"
              />
              <span aria-hidden className="cp-scrim" />
              <span aria-hidden className="cp-varnish" />

              <span className="cp-masthead font-display">SPX MAGAZINE</span>
              <span className="cp-lines">
                {s.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
              <span className="cp-no font-display">{s.no}</span>
            </motion.figure>
          ))}
        </div>

        <p className="cp-caption">
          Cover studies for Issue 01. Art by{" "}
          <Link href="/learn/project-aeon" className="cp-link">
            Project AEON
          </Link>
          .
        </p>
      </div>

      <style>{`
        /* ComingSoon above already measures itself to fill the viewport, so the
           travel here is kept short — taller would leave the page mostly empty
           on the way past. */
        .cp-section { position: relative; height: 120vh; }

        /* The stage keeps real height: centring the plates on a zero-height
           line clipped them against the header and let the caption land on top
           of the artwork. */
        .cp-stage {
          position: sticky;
          top: 14vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.5rem, 4vh, 2.5rem);
        }
        .cp-deck { display: grid; place-items: center; }

        .cp-plate {
          grid-area: 1 / 1;
          position: relative;
          width: clamp(180px, 21vw, 250px);
          aspect-ratio: 513 / 700;   /* the source exactly: no crop distortion */
          overflow: hidden;
          border-radius: 3px;        /* a print trim, not a rounded card */
          border: 1px solid color-mix(in oklab, var(--color-gold-400) 28%, transparent);
          box-shadow: 0 30px 60px -30px #000;
          isolation: isolate;
          will-change: transform;
        }
        .cp-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Deep enough that the source's own HUD text cannot ghost through
           under the masthead — lighter reads as a mistake. */
        .cp-scrim {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(10, 10, 11, 0.95) 0%,
            rgba(10, 10, 11, 0.95) 14%,
            rgba(10, 10, 11, 0.1) 34%,
            rgba(10, 10, 11, 0.55) 78%,
            rgba(10, 10, 11, 0.92) 100%
          );
        }
        .cp-varnish {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.10) 50%, transparent 60%);
        }
        .cp-masthead {
          position: absolute; top: 4.5%; left: 0; right: 0;
          text-align: center;
          font-size: clamp(9px, 1.4vw, 12px);
          font-weight: 800; letter-spacing: 0.16em;
          color: var(--color-gold-300);
        }
        .cp-lines {
          position: absolute; left: 7%; bottom: 7%;
          display: flex; flex-direction: column; gap: 3px;
          font-size: 8px; text-transform: uppercase; letter-spacing: 0.16em;
          color: color-mix(in oklab, var(--color-mag-white) 82%, transparent);
        }
        .cp-no {
          position: absolute; right: 7%; bottom: 6%;
          font-size: 13px; font-weight: 800; letter-spacing: 0.06em;
          color: color-mix(in oklab, var(--color-gold-300) 85%, transparent);
        }
        .cp-caption { text-align: center; font-size: 12px; color: var(--color-mag-muted); }
        .cp-link {
          color: var(--color-gold-300);
          text-decoration: underline; text-underline-offset: 3px;
          text-decoration-color: color-mix(in oklab, var(--color-gold-400) 45%, transparent);
        }
      `}</style>
    </section>
  );
}
