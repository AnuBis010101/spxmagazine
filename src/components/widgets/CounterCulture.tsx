"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  Cpu,
  HeartCrack,
  Minus,
  ShieldOff,
  TrendingDown,
  Unlink,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
  { title: string; subtitle: string; accent: string; icon: LucideIcon }
> = {
  loneliness: {
    title: "The Loneliness Epidemic",
    subtitle: "The surgeon general calls it a public health crisis.",
    accent: "#fb7185",
    icon: Users,
  },
  doomerism: {
    title: "Doomerism Rising",
    subtitle: "Record pessimism about the future.",
    accent: "#fb923c",
    icon: TrendingDown,
  },
  meaning: {
    title: "The Meaning Crisis",
    subtitle: "Secular, lost, searching for purpose.",
    accent: "#fbbf24",
    icon: Compass,
  },
  ai: {
    title: "AI Anxiety",
    subtitle: "The machines are here. Most people aren't ready.",
    accent: "#22d3ee",
    icon: Cpu,
  },
  trust: {
    title: "Trust Collapse",
    subtitle: "Institutions losing their grip on legitimacy.",
    accent: "#a78bfa",
    icon: ShieldOff,
  },
  despair: {
    title: "Deaths of Despair",
    subtitle: "Drugs, alcohol, suicide — the unseen toll.",
    accent: "#f87171",
    icon: HeartCrack,
  },
  fragmentation: {
    title: "Social Fragmentation",
    subtitle: "The fabric of community pulling apart.",
    accent: "#f472b6",
    icon: Unlink,
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

/* ── Animated count-up value ────────────────────────────────────────────────
   Values are free-form strings ("24%", "~107,500", "14.3", "Near lows"…). We
   pull out the first numeric run and tick it up from zero while preserving any
   prefix/suffix; purely textual values render as-is. */
function parseValue(value: string) {
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return { num: null as number | null, pre: "", post: "", decimals: 0 };
  const numStr = m[2];
  const dot = numStr.indexOf(".");
  return {
    num: parseFloat(numStr.replace(/,/g, "")),
    pre: m[1],
    post: m[3],
    decimals: dot === -1 ? 0 : numStr.length - dot - 1,
  };
}

function AnimatedValue({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const parsed = useMemo(() => parseValue(value), [value]);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (parsed.num === null || !inView || reduce) return;
    let raf = 0;
    const to = parsed.num;
    const start = performance.now();
    const dur = 1300;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, parsed, reduce]);

  if (parsed.num === null) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    );
  }

  const shown = reduce ? parsed.num : inView ? display : 0;
  const formatted = shown.toLocaleString("en-US", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {parsed.pre}
      {formatted}
      {parsed.post}
    </span>
  );
}

function TrendPill({ direction }: { direction: Metric["direction"] }) {
  const bad = direction !== "flat";
  const Icon =
    direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-[3px] ring-1 transition-colors",
        bad
          ? "bg-red-500/10 text-red-300 ring-red-500/20"
          : "bg-white/5 text-mag-muted ring-white/10"
      )}
      aria-label={`Trend ${direction}`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.75} />
    </span>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index, 8) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 320, damping: 22 } }}
      style={{ "--accent": accent } as React.CSSProperties}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-mag-dark p-5 transition-colors duration-300 hover:border-white/[0.14]"
    >
      {/* surface gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.045] to-transparent"
      />
      {/* top hairline sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      {/* accent corner glow (blooms on hover) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 68%)` }}
      />
      {/* diagonal shine sweep on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[130%] transition-transform duration-[900ms] ease-out group-hover:translate-x-[130%]"
        style={{
          background:
            "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.07) 50%, transparent 58%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 font-body text-[11px] uppercase leading-snug tracking-wider text-mag-muted">
            {metric.label}
          </p>
          <TrendPill direction={metric.direction} />
        </div>

        <div className="mt-4">
          <AnimatedValue
            value={metric.value}
            className="font-display text-[27px] font-bold leading-none tracking-tight tabular-nums md:text-[31px]"
            style={{ color: accent, textShadow: `0 0 26px ${accent}33` }}
          />
        </div>

        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-mag-muted">
          {metric.context}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
          <span className="truncate font-body text-[10px] uppercase tracking-wider text-white/40">
            {metric.source}
          </span>
          <span className="shrink-0 text-[10px] tabular-nums text-white/30">
            {metric.asOf}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({
  title,
  subtitle,
  accent,
  icon: Icon,
  count,
}: {
  title: string;
  subtitle: string;
  accent: string;
  icon: LucideIcon;
  count: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3.5">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10"
          style={{
            background: `linear-gradient(135deg, ${accent}26, transparent 70%)`,
            color: accent,
            boxShadow: `inset 0 0 18px ${accent}1f`,
          }}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </motion.div>

        <div className="min-w-0">
          <h3
            className="font-display text-lg font-bold tracking-tight md:text-xl"
            style={{ color: accent }}
          >
            {title}
          </h3>
          <p className="text-sm text-mag-muted">{subtitle}</p>
        </div>

        <span className="ml-auto hidden shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-body text-[10px] uppercase tracking-wider text-white/45 sm:block">
          {count} {count === 1 ? "signal" : "signals"}
        </span>
      </div>

      {/* animated accent underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mt-4 h-px origin-left"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}22 40%, transparent)` }}
      />
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-2xl border border-white/[0.06] bg-mag-dark p-5"
        >
          <div className="h-3 w-24 rounded bg-white/[0.06]" />
          <div className="mt-4 h-8 w-20 rounded bg-white/[0.08]" />
          <div className="mt-4 h-3 w-full rounded bg-white/[0.06]" />
          <div className="mt-2 h-3 w-2/3 rounded bg-white/[0.06]" />
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
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-sm text-red-400">
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
    <div className="space-y-12">
      {CATEGORY_ORDER.map((cat) => {
        const metrics = grouped.get(cat);
        if (!metrics || metrics.length === 0) return null;
        const meta = CATEGORY_META[cat];

        return (
          <div key={cat}>
            <SectionHeader
              title={meta.title}
              subtitle={meta.subtitle}
              accent={meta.accent}
              icon={meta.icon}
              count={metrics.length}
            />
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
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
        className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-[rgba(15,12,6,0.85)] px-6 py-10 text-center backdrop-blur-xl"
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

        <p className="mx-auto max-w-3xl bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text font-display text-xl font-semibold text-transparent md:text-2xl">
          Numbers don&apos;t lie. The world is fragmenting.
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-body text-sm text-mag-muted md:text-base">
          SPX6900 is how we put it back together. Kill them with love. Aeons are
          always euphoric.
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
