"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import Sparkline from "@/components/widgets/Sparkline";
import { useRollingSeries } from "@/hooks/useRollingSeries";

interface HolderData {
  chain: string;
  holders: string | number;
  address: string;
  explorer: string;
}

interface HoldersData {
  holders: HolderData[];
  lastUpdated: string;
}

function parseCount(value: string | number): number {
  if (typeof value === "number") return value;
  const n = parseInt(value.replace(/,/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

// Chain accent colours
const CHAIN_COLORS: Record<string, { text: string; glow: string; dot: string }> = {
  Ethereum: {
    text: "text-[#627EEA]",
    glow: "hover:shadow-[0_0_24px_rgba(98,126,234,0.25)]",
    dot: "bg-[#627EEA]",
  },
  Solana: {
    text: "text-[#9945FF]",
    glow: "hover:shadow-[0_0_24px_rgba(153,69,255,0.25)]",
    dot: "bg-[#9945FF]",
  },
  Base: {
    text: "text-[#0052FF]",
    glow: "hover:shadow-[0_0_24px_rgba(0,82,255,0.25)]",
    dot: "bg-[#0052FF]",
  },
};

// Animated number that counts up from 0 to target
function AnimatedNumber({ target, duration = 1.8 }: { target: number; duration?: number }) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  return <motion.span>{display}</motion.span>;
}

// Large counting total with staggered character reveal
function TotalCounter({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const spring = useSpring(0, { duration: 2200, bounce: 0 });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString("en-US")
  );

  useEffect(() => {
    if (inView) spring.set(total);
  }, [inView, total, spring]);

  return (
    <div ref={ref} className="relative">
      {/* Glow behind number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-64 h-16 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(ellipse, #D4AF37 0%, transparent 70%)" }}
        />
      </div>

      <motion.p
        className="relative font-display text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent tabular-nums"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {display}
      </motion.p>
    </div>
  );
}

// Horizontal bar showing each chain's share of the total
function ChainBreakdown({ holders }: { holders: HolderData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const counts = holders.map((h) => parseCount(h.holders));
  const total = counts.reduce((a, b) => a + b, 0);

  const segments = holders.map((h, i) => ({
    chain: h.chain,
    count: counts[i],
    pct: total > 0 ? (counts[i] / total) * 100 : 0,
  }));

  const segColors = ["bg-[#627EEA]", "bg-[#9945FF]", "bg-[#0052FF]"];

  return (
    <div ref={ref} className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.chain}
            className={`${segColors[i]} h-full rounded-full`}
            initial={{ width: 0 }}
            animate={inView ? { width: `${seg.pct}%` } : { width: 0 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.chain}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${segColors[i]}`} />
            <span className="text-xs text-mag-muted font-body">
              {seg.chain}
              <span className="text-white ml-1.5 font-semibold">
                {seg.pct.toFixed(1)}%
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-mag-dark border border-mag-border p-6 md:p-8 space-y-4">
      <div className="h-4 w-24 rounded bg-mag-border" />
      <div className="h-8 w-32 rounded bg-mag-border" />
      <div className="h-px w-full bg-mag-border" />
      <div className="h-3 w-full rounded bg-mag-border" />
      <div className="h-3 w-20 rounded bg-mag-border" />
    </div>
  );
}

export default function HoldersTracker() {
  const [data, setData] = useState<HoldersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/holders");
        if (!response.ok) throw new Error("Failed to fetch holder data");
        const result: HoldersData = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
    // Refresh every 8 hours — aligned with server-side cache (3× per day)
    const interval = setInterval(fetchHolders, 8 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Total across chains + a rolling buffer for the trend sparkline. Computed
  // before the early returns so the hook order stays stable. Holders refresh
  // only ~3×/day, so this series builds over days (kept up to 14d).
  const total = data?.holders
    ? data.holders.reduce((sum, h) => sum + parseCount(h.holders), 0)
    : 0;
  const holdersSeries = useRollingSeries("spx-holders-series", total, {
    maxAgeMs: 14 * 24 * 60 * 60 * 1000,
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="h-48 rounded-2xl bg-mag-dark border border-mag-border animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
        <p className="text-red-400 text-sm">Unable to load holder data. Please try again later.</p>
      </div>
    );
  }

  if (!data?.holders) return null;

  return (
    <div className="space-y-4">
      {/* ── Chain cards ─────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4">
        {data.holders.map((holder, idx) => {
          const colors = CHAIN_COLORS[holder.chain] ?? {
            text: "text-gold-400",
            glow: "hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]",
            dot: "bg-gold-400",
          };
          const count = parseCount(holder.holders);

          return (
            <motion.a
              key={holder.chain}
              href={holder.explorer}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block rounded-2xl bg-mag-dark border border-mag-border p-6 md:p-8 hover:border-white/10 ${colors.glow} transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              {/* Chain name with coloured dot */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <h3 className={`font-display text-lg font-bold ${colors.text} group-hover:brightness-110 transition-all`}>
                  {holder.chain}
                </h3>
              </div>

              {/* Holder count */}
              <div className="mt-5">
                <p className="text-xs text-mag-muted uppercase tracking-wider font-body">
                  Total Holders
                  {holder.chain === "Base" && (
                    <span className="ml-1.5 normal-case tracking-normal text-gold-400/70 italic">
                      excluding below $2
                    </span>
                  )}
                </p>
                <p className="mt-1.5 font-display text-3xl md:text-4xl font-bold text-white tabular-nums">
                  {count > 0 ? (
                    <AnimatedNumber target={count} />
                  ) : (
                    holder.holders
                  )}
                </p>
              </div>

              {/* Contract address */}
              <div className="mt-6 pt-5 border-t border-mag-border">
                <p className="text-xs text-mag-muted uppercase tracking-wider font-body">
                  Contract
                </p>
                <p className={`mt-1.5 font-mono text-xs ${colors.text} opacity-70 group-hover:opacity-100 transition-opacity truncate`}>
                  {holder.address}
                </p>
              </div>

              {/* External link */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-mag-muted group-hover:text-white transition-colors">
                  View on Explorer
                </span>
                <svg
                  className={`w-4 h-4 ${colors.text} opacity-50 group-hover:opacity-100 transition-opacity`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* ── Total holders banner ─────────────────────────────────────── */}
      {total > 0 && (
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-[rgba(15,12,6,0.8)] backdrop-blur-xl px-6 py-10 sm:py-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Decorative background pulse rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-gold-400/10"
                initial={{ width: 80, height: 80, opacity: 0.6 }}
                animate={{ width: 80 + i * 120, height: 80 + i * 120, opacity: 0 }}
                transition={{
                  duration: 3,
                  delay: i * 0.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Subtle gold shimmer band */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
            }}
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Label */}
          <p className="text-xs sm:text-sm font-display font-semibold uppercase tracking-[0.2em] text-gold-400/70 mb-3">
            Total SPX6900 Holders Across All Chains
          </p>

          {/* Animated total */}
          <TotalCounter total={total} />

          {/* Live trend sparkline (client-accumulated; see useRollingSeries) */}
          <div className="mt-5 flex justify-center">
            <Sparkline data={holdersSeries} label="Trend" />
          </div>

          {/* Breakdown bar */}
          <div className="mt-8 max-w-lg mx-auto">
            <ChainBreakdown holders={data.holders} />
          </div>

          {/* Last updated */}
          <p className="mt-6 text-xs text-mag-muted">
            Updated{" "}
            {data.lastUpdated
              ? new Date(data.lastUpdated).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
            {" · "}refreshed 3× daily
          </p>
        </motion.div>
      )}
    </div>
  );
}
