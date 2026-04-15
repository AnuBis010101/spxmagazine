"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Category =
  | "loneliness"
  | "doomerism"
  | "meaning"
  | "ai"
  | "trust"
  | "despair"
  | "fragmentation";

interface Metric {
  id: string;
  category: Category;
  label: string;
  value: string;
  context: string;
  source: string;
  asOf: string;
  direction: "up" | "down" | "flat";
}

interface CounterCultureData {
  metrics: Metric[];
  lastUpdated: string;
}

const CATEGORY_META: Record<
  Category,
  { title: string; subtitle: string; accent: string }
> = {
  loneliness: {
    title: "The Loneliness Epidemic",
    subtitle: "The surgeon general calls it a public health crisis.",
    accent: "text-rose-400",
  },
  doomerism: {
    title: "Doomerism Rising",
    subtitle: "Record pessimism about the future.",
    accent: "text-orange-400",
  },
  meaning: {
    title: "The Meaning Crisis",
    subtitle: "Secular, lost, searching for purpose.",
    accent: "text-amber-400",
  },
  ai: {
    title: "AI Anxiety",
    subtitle: "The machines are here. Most people aren't ready.",
    accent: "text-cyan-400",
  },
  trust: {
    title: "Trust Collapse",
    subtitle: "Institutions losing their grip on legitimacy.",
    accent: "text-violet-400",
  },
  despair: {
    title: "Deaths of Despair",
    subtitle: "Drugs, alcohol, suicide — the unseen toll.",
    accent: "text-red-500",
  },
  fragmentation: {
    title: "Social Fragmentation",
    subtitle: "The fabric of community pulling apart.",
    accent: "text-pink-400",
  },
};

const CATEGORY_ORDER: Category[] = [
  "loneliness",
  "doomerism",
  "meaning",
  "ai",
  "trust",
  "despair",
  "fragmentation",
];

function DirectionIcon({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up") {
    return (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l10-10M7 7h10v10" />
      </svg>
    );
  }
  if (direction === "down") {
    return (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10M7 17h10V7" />
      </svg>
    );
  }
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function MetricCard({
  metric,
  accent,
  index,
}: {
  metric: Metric;
  accent: string;
  index: number;
}) {
  const dirColor =
    metric.direction === "up"
      ? "text-red-400"
      : metric.direction === "down"
        ? "text-red-400"
        : "text-mag-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative rounded-xl bg-mag-dark border border-mag-border p-4 md:p-5 hover:border-gold-400/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] text-mag-muted uppercase tracking-wider font-body leading-snug flex-1 min-w-0">
          {metric.label}
        </p>
        <div
          className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-mag-black/50 ${dirColor}`}
          aria-label={`Trend ${metric.direction}`}
        >
          <DirectionIcon direction={metric.direction} />
        </div>
      </div>

      <p
        className={`mt-3 font-display text-2xl md:text-3xl font-bold tabular-nums ${accent}`}
      >
        {metric.value}
      </p>

      <p className="mt-2 text-xs text-mag-muted leading-relaxed line-clamp-3">
        {metric.context}
      </p>

      <div className="mt-3 pt-3 border-t border-mag-border/60 flex items-center justify-between gap-2">
        <span className="text-[10px] text-gold-400/60 uppercase tracking-wider font-body truncate">
          {metric.source}
        </span>
        <span className="text-[10px] text-mag-muted shrink-0">{metric.asOf}</span>
      </div>
    </motion.div>
  );
}

function SectionHeader({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="mb-5">
      <h3 className={`font-display text-lg md:text-xl font-bold ${accent}`}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-mag-muted">{subtitle}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-mag-dark border border-mag-border p-4 h-40"
        >
          <div className="h-3 w-24 rounded bg-mag-border" />
          <div className="mt-3 h-8 w-20 rounded bg-mag-border" />
          <div className="mt-3 h-3 w-full rounded bg-mag-border" />
          <div className="mt-2 h-3 w-2/3 rounded bg-mag-border" />
        </div>
      ))}
    </div>
  );
}

export default function CounterCulture() {
  const [data, setData] = useState<CounterCultureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/counter-culture");
        if (!res.ok) throw new Error("Failed to fetch");
        const json: CounterCultureData = await res.json();
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
    // Refresh every 7 days on client — data itself refreshes monthly server-side
    const interval = setInterval(fetchData, 7 * 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Skeleton />;

  if (error || !data) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
        <p className="text-red-400 text-sm">
          Unable to load data. Please try again later.
        </p>
      </div>
    );
  }

  // Group metrics by category
  const grouped = new Map<Category, Metric[]>();
  for (const m of data.metrics) {
    if (!grouped.has(m.category)) grouped.set(m.category, []);
    grouped.get(m.category)!.push(m);
  }

  return (
    <div className="space-y-10">
      {CATEGORY_ORDER.map((cat) => {
        const metrics = grouped.get(cat);
        if (!metrics || metrics.length === 0) return null;
        const meta = CATEGORY_META[cat];

        return (
          <div key={cat}>
            <SectionHeader {...meta} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {metrics.map((m, i) => (
                <MetricCard key={m.id} metric={m} accent={meta.accent} index={i} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Movement closing banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-[rgba(15,12,6,0.85)] backdrop-blur-xl px-6 py-10 text-center"
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
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
          }}
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <p className="font-display text-xl md:text-2xl bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent font-semibold max-w-3xl mx-auto">
          Numbers don&apos;t lie. The world is fragmenting.
        </p>
        <p className="mt-3 text-sm md:text-base text-mag-muted max-w-2xl mx-auto font-body">
          SPX6900 is how we put it back together. Kill them with love.
          Aeons are always euphoric.
        </p>
        <p className="mt-5 text-xs text-mag-muted">
          Last updated{" "}
          {data.lastUpdated
            ? new Date(data.lastUpdated).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
          {" · "}refreshed monthly
        </p>
      </motion.div>
    </div>
  );
}
