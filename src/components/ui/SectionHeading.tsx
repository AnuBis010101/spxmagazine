import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  /** Two-digit folio numeral, e.g. "01". Rendered as a ghosted stroke-only
   *  numeral behind/beside the heading. Omit to skip the numeral. */
  folio?: string;
  /** Small uppercase kicker shown after the gold rule (required). */
  eyebrow: string;
  /** The heading text (rendered at the SMALLER text-display-sm scale). */
  title: ReactNode;
  /** Optional supporting sentence under the heading. */
  standfirst?: ReactNode;
  /** Layout: left department masthead (default) or centered. */
  align?: "left" | "center";
  /** Optional right-aligned slot (e.g. a "View all" link or controls).
   *  Only used when align="left"; ignored for centered headings. */
  right?: ReactNode;
  /** Extra classes for the <h2>. */
  titleClassName?: string;
  /** Extra classes for the outer wrapper. */
  className?: string;
}

/**
 * SectionHeading — a magazine "department" masthead.
 *
 * Anatomy:
 *   - a ghosted, stroke-only folio numeral (WebkitTextStroke gold, low opacity)
 *     placed behind/beside the header. It is aria-hidden and pointer-events-none,
 *     and lives inside an overflow-clipped, contain-relative wrapper so an oversized
 *     numeral never triggers horizontal page scroll.
 *   - an eyebrow: an 8px gold rule + uppercase tracking-[0.18em] gold kicker.
 *   - the heading at text-display-sm (deliberately smaller than the old 3xl/4xl).
 *   - an optional standfirst and an optional right slot (left layout only).
 *
 * WHY inline style for the numeral: Tailwind v4's Lightning CSS can reject/drop
 * -webkit-text-stroke authored in a stylesheet; inline styles bypass Lightning
 * and render reliably. Reduced-motion needs no handling — the numeral is static.
 */
export default function SectionHeading({
  folio,
  eyebrow,
  title,
  standfirst,
  align = "left",
  right,
  titleClassName,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  const numeral = folio ? (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none absolute -z-10 font-display font-bold leading-none",
        "text-[5.5rem] sm:text-[7rem] md:text-[8.5rem]",
        centered
          ? "left-1/2 -translate-x-1/2 -top-8 sm:-top-12"
          : "left-0 -top-8 sm:-top-11 md:-top-14"
      )}
      style={{
        WebkitTextStroke: "1px rgba(212,175,55,0.22)",
        color: "transparent",
        letterSpacing: "-0.04em",
      }}
    >
      {folio}
    </span>
  ) : null;

  const eyebrowRow = (
    <div
      className={cn(
        "flex items-center gap-3",
        centered && "justify-center"
      )}
    >
      <span className="w-8 h-px bg-gold-400/40" aria-hidden="true" />
      <span className="text-xs uppercase tracking-[0.18em] text-gold-400/70 font-medium">
        {eyebrow}
      </span>
    </div>
  );

  const heading = (
    <h2
      className={cn(
        "font-display text-display-sm text-white",
        centered ? "mt-3" : "mt-2.5",
        titleClassName
      )}
    >
      {title}
    </h2>
  );

  const standfirstEl = standfirst ? (
    <p
      className={cn(
        "text-mag-muted mt-2",
        centered ? "max-w-xl mx-auto" : "max-w-2xl"
      )}
    >
      {standfirst}
    </p>
  ) : null;

  if (centered) {
    return (
      <div
        className={cn(
          "relative isolate overflow-x-clip text-center",
          className
        )}
      >
        {numeral}
        <div className="relative">
          {eyebrowRow}
          {heading}
          {standfirstEl}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative isolate overflow-x-clip",
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      {numeral}
      <div className="relative">
        {eyebrowRow}
        {heading}
        {standfirstEl}
      </div>
      {right ? (
        <div className="relative shrink-0 sm:pb-1">{right}</div>
      ) : null}
    </div>
  );
}
