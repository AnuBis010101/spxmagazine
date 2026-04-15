"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Metric {
  value: number | string;
  label: string;
  context?: string;
  source?: string;
}

interface StateOfWorldData {
  cryptoFearGreed: Metric;
  stockFearGreed: Metric;
  vix: Metric;
  googleLonelyTrend: Metric;
  globalLoneliness: Metric;
  trustInstitutions: Metric;
  lastUpdated: string;
}

// Colour mapping for Fear & Greed 0-100 scores
function fearGreedColor(value: number | string): string {
  if (typeof value !== "number") return "text-gold-400";
  if (value <= 24) return "text-red-500"; // Extreme Fear
  if (value <= 44) return "text-orange-400"; // Fear
  if (value <= 55) return "text-yellow-400"; // Neutral
  if (value <= 74) return "text-lime-400"; // Greed
  return "text-green-500"; // Extreme Greed
}

function vixColor(value: number | string): string {
  if (typeof value !== "number") return "text-gold-400";
  if (value < 15) return "text-green-400";
  if (value < 20) return "text-lime-400";
  if (value < 30) return "text-orange-400";
  return "text-red-500";
}

function MetricCard({
  metric,
  valueColor,
  icon,
  delay,
}: {
  metric: Metric;
  valueColor?: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="group relative rounded-2xl bg-mag-dark border border-mag-border p-5 md:p-6 hover:border-gold-400/30 transition-all duration-300 overflow-hidden"
    >
      {/* Subtle gold glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute -inset-px rounded-2xl"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08), transparent 60%)",
          }}
        />
      </div>

      <div className="relative flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-mag-black/50 border border-mag-border flex items-center justify-center text-gold-400">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-mag-muted uppercase tracking-wider font-body truncate">
            {metric.label}
          </p>
          <p
            className={`mt-2 font-display text-3xl md:text-4xl font-bold tabular-nums ${valueColor ?? "text-white"}`}
          >
            {typeof metric.value === "number"
              ? metric.value.toLocaleString("en-US")
              : metric.value}
            {(metric.label.toLowerCase().includes("lonely") ||
              metric.label.toLowerCase().includes("trust")) &&
              typeof metric.value === "number" && (
                <span className="text-xl text-mag-muted ml-1">%</span>
              )}
          </p>
          {metric.context && (
            <p className="mt-2 text-xs text-mag-muted leading-relaxed">
              {metric.context}
            </p>
          )}
          {metric.source && (
            <p className="mt-2 text-[10px] text-gold-400/50 uppercase tracking-wider font-body">
              {metric.source}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-mag-dark border border-mag-border p-5 md:p-6">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-mag-border" />
        <div className="flex-1 space-y-3">
          <div className="h-3 w-28 rounded bg-mag-border" />
          <div className="h-8 w-20 rounded bg-mag-border" />
          <div className="h-3 w-full rounded bg-mag-border" />
        </div>
      </div>
    </div>
  );
}

// Icons
const IconPulse = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12h4l3-9 4 18 3-9h4"
    />
  </svg>
);
const IconChart = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3v18h18M7 17l4-8 3 5 5-10"
    />
  </svg>
);
const IconBolt = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const IconSearch = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const IconUser = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const IconShield = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
    />
  </svg>
);

export default function StateOfWorld() {
  const [data, setData] = useState<StateOfWorldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/state-of-world");
        if (!res.ok) throw new Error("Failed to fetch");
        const json: StateOfWorldData = await res.json();
        setData(json);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 24h — aligned with server-side daily cron
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
        <p className="text-red-400 text-sm">
          Unable to load world data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          metric={data.cryptoFearGreed}
          valueColor={fearGreedColor(data.cryptoFearGreed.value)}
          icon={IconPulse}
          delay={0}
        />
        <MetricCard
          metric={data.stockFearGreed}
          valueColor={fearGreedColor(data.stockFearGreed.value)}
          icon={IconChart}
          delay={0.08}
        />
        <MetricCard
          metric={data.vix}
          valueColor={vixColor(data.vix.value)}
          icon={IconBolt}
          delay={0.16}
        />
        <MetricCard
          metric={data.googleLonelyTrend}
          valueColor="text-gold-400"
          icon={IconSearch}
          delay={0.24}
        />
        <MetricCard
          metric={data.globalLoneliness}
          valueColor="text-gold-400"
          icon={IconUser}
          delay={0.32}
        />
        <MetricCard
          metric={data.trustInstitutions}
          valueColor="text-gold-400"
          icon={IconShield}
          delay={0.4}
        />
      </div>

      {/* Movement message + last updated */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-[rgba(15,12,6,0.8)] backdrop-blur-xl px-6 py-8 text-center"
      >
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <p className="font-display text-lg md:text-xl bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent font-semibold">
          The world is anxious. You&apos;re not alone.
        </p>
        <p className="mt-2 text-sm text-mag-muted max-w-xl mx-auto font-body">
          The movement says: kill them with love. Aeons are always euphoric.
        </p>
        <p className="mt-4 text-xs text-mag-muted">
          Updated{" "}
          {data.lastUpdated
            ? new Date(data.lastUpdated).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
          {" · "}refreshed daily
        </p>
      </motion.div>
    </div>
  );
}
