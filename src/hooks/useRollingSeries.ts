"use client";

import { useState, useEffect, useRef } from "react";

export interface SeriesPoint {
  t: number;
  v: number;
}

interface Options {
  /** Max points kept (oldest dropped). */
  cap?: number;
  /** Points older than this are pruned on read/append. */
  maxAgeMs?: number;
}

/**
 * A client-side, localStorage-persisted rolling time series.
 *
 * The price and holders APIs expose only the *current* value — there is no
 * historical series to chart. This hook accumulates the values a visitor polls
 * over time (deduping identical consecutive readings) so a sparkline can grow
 * across a session and, via localStorage, across return visits within maxAge.
 * On a first-ever visit the series is short/empty by design (the data gap);
 * callers should treat < 3 points as "not enough to draw yet".
 */
export function useRollingSeries(
  key: string,
  value: number,
  { cap = 40, maxAgeMs = 24 * 60 * 60 * 1000 }: Options = {}
): SeriesPoint[] {
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const hydrated = useRef(false);

  // Hydrate from localStorage once (client only), pruning stale points.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const now = Date.now();
        if (Array.isArray(parsed)) {
          setSeries(
            parsed.filter(
              (p) =>
                p &&
                typeof p.v === "number" &&
                typeof p.t === "number" &&
                now - p.t < maxAgeMs
            )
          );
        }
      }
    } catch {
      /* corrupt/unavailable storage — start empty */
    }
    hydrated.current = true;
  }, [key, maxAgeMs]);

  // Append when the value meaningfully changes.
  useEffect(() => {
    if (!hydrated.current) return;
    if (!Number.isFinite(value) || value <= 0) return;
    setSeries((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.v === value) return prev; // dedupe identical readings
      const now = Date.now();
      const next = [
        ...prev.filter((p) => now - p.t < maxAgeMs),
        { t: now, v: value },
      ].slice(-cap);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore quota/availability errors */
      }
      return next;
    });
  }, [value, key, cap, maxAgeMs]);

  return series;
}
