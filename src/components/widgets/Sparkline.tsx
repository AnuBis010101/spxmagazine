"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SeriesPoint } from "@/hooks/useRollingSeries";

interface SparklineProps {
  data: SeriesPoint[];
  /** Small caption next to the pulse dot. Pass null to hide. */
  label?: string | null;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * A tiny gold sparkline with a live pulse dot, fed by a client-side rolling
 * buffer (see useRollingSeries). Renders the pulse immediately; the line only
 * once there are enough points to be meaningful (the data gap is honest, not
 * a fake flat line). Cheap: one memoised SVG path, one pulse.
 */
export default function Sparkline({
  data,
  label = "Live",
  width = 92,
  height = 26,
  className,
}: SparklineProps) {
  const reduce = useReducedMotion();
  const gradientId = useId();

  const geom = useMemo(() => {
    const vals = data.map((d) => d.v);
    if (vals.length < 3) return null;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const n = vals.length;
    const pts = vals.map((v, i) => {
      const x = (i / (n - 1)) * (width - 2) + 1;
      const y = height - 2 - ((v - min) / range) * (height - 4);
      return [x, y] as const;
    });
    const line = pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
      .join(" ");
    const area = `${line} L${pts[n - 1][0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height} Z`;
    const up = vals[n - 1] >= vals[0];
    return { line, area, lastX: pts[n - 1][0], lastY: pts[n - 1][1], up };
  }, [data, width, height]);

  const stroke = geom && !geom.up ? "var(--color-mag-muted)" : "var(--color-gold-400)";

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {/* Live pulse dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        {!reduce && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-gold-400"
            animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
      </span>
      {label && (
        <span className="text-[10px] uppercase tracking-wider font-display text-gold-400/70">
          {label}
        </span>
      )}
      {geom && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.32" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={geom.area} fill={`url(#${gradientId})`} />
          <path
            d={geom.line}
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={geom.lastX} cy={geom.lastY} r="2" fill={stroke} />
        </svg>
      )}
    </div>
  );
}
