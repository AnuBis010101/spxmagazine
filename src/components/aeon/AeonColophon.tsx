"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AeonMark from "@/components/aeon/AeonMark";

/* ─────────────────────────────────────────────────────────────────────────
   A printer's device closing a section.

   The three showcase pages already end with the same sign-off paragraph in
   the same slot with the same reveal signature; this sits above it. One
   different frame per page is what turns "Aeon art on the site" into an
   identity system rather than three assorted placements.

   No rotating ring. Every other ring in this codebase stays invisible until
   hover, and a mark that spins forever stops reading as a device and starts
   reading as a widget.
   ──────────────────────────────────────────────────────────────────────── */

export default function AeonColophon({ id }: { id: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="ac-wrap mx-auto mt-16 w-fit"
    >
      <Link href="/learn/project-aeon" aria-label="Project AEON" className="ac-link">
        <AeonMark id={id} size={60} />
      </Link>

      <style>{`
        .ac-link {
          display: block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ac-link:hover { transform: scale(1.06); }
        @media (prefers-reduced-motion: reduce) {
          .ac-link { transition: none; }
          .ac-link:hover { transform: none; }
        }
      `}</style>
    </motion.div>
  );
}
