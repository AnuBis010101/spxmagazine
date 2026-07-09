"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { usePrice } from "@/hooks/usePrice";
import { ChevronDown } from "lucide-react";
import CountUp from "@/components/widgets/CountUp";
import FlippeningCelebration from "@/components/widgets/FlippeningCelebration";
import Sparkline from "@/components/widgets/Sparkline";
import { useRollingSeries } from "@/hooks/useRollingSeries";
import { cn } from "@/lib/utils/cn";

const CELEBRATED_TIER_KEY = "spx-flippening-tier";

interface Tier {
  label: string;
  value: number;
}

// Fixed waypoints toward the flippening. The final tier is appended at runtime
// from the *live* S&P 500 market cap (see buildTiers) so the target adapts.
const FIXED_TIERS: Tier[] = [
  { label: "$1B", value: 1_000_000_000 },
  { label: "$10B", value: 10_000_000_000 },
  { label: "$100B", value: 100_000_000_000 },
  { label: "$1T", value: 1_000_000_000_000 },
  { label: "$10T", value: 10_000_000_000_000 },
];

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000)
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function formatMultiplier(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(1);
}

/** Milestones with the final tier pinned to the live S&P 500 market cap, so the
 *  flippening target tracks the real index rather than a frozen $50T. */
function buildTiers(sp500MarketCap: number): Tier[] {
  const top: Tier =
    sp500MarketCap > 10_000_000_000_000
      ? { label: formatCurrency(sp500MarketCap), value: sp500MarketCap }
      : { label: "$50T", value: 50_000_000_000_000 };
  return [...FIXED_TIERS, top];
}

function getTierProgress(marketCap: number, tiers: Tier[]) {
  let currentTierIdx = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (marketCap < tiers[i].value) {
      currentTierIdx = i;
      break;
    }
    if (i === tiers.length - 1) {
      currentTierIdx = tiers.length - 1;
    }
  }

  const tierFloor = currentTierIdx === 0 ? 0 : tiers[currentTierIdx - 1].value;
  const tierCeiling = tiers[currentTierIdx].value;
  const progressInTier =
    marketCap >= tierCeiling
      ? 100
      : ((marketCap - tierFloor) / (tierCeiling - tierFloor)) * 100;

  return {
    currentTierIdx,
    tierFloor,
    tierCeiling,
    progressInTier: Math.max(0, Math.min(100, progressInTier)),
    currentTierLabel: tiers[currentTierIdx].label,
    previousTierLabel: currentTierIdx > 0 ? tiers[currentTierIdx - 1].label : "$0",
  };
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex justify-between">
        <div className="h-6 w-48 rounded bg-mag-border" />
        <div className="h-6 w-32 rounded bg-mag-border" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded-full bg-mag-border" />
        ))}
      </div>
      <div className="flex justify-between">
        <div className="h-5 w-36 rounded bg-mag-border" />
        <div className="h-5 w-28 rounded bg-mag-border" />
      </div>
    </div>
  );
}

function TierBar({
  tierIdx,
  currentTierIdx,
  progressInTier,
  label,
  previousLabel,
}: {
  tierIdx: number;
  currentTierIdx: number;
  progressInTier: number;
  label: string;
  previousLabel: string;
}) {
  const isCompleted = tierIdx < currentTierIdx;
  const isCurrent = tierIdx === currentTierIdx;
  const isLocked = tierIdx > currentTierIdx;

  // Faster spring for snappier bar animation
  const springValue = useSpring(0, { stiffness: 120, damping: 30 });
  const barWidth = useTransform(springValue, (v) => `${v}%`);

  if (isCurrent && progressInTier > 0) {
    springValue.set(progressInTier);
  } else if (isCompleted) {
    springValue.set(100);
  }

  return (
    <div className={`transition-opacity duration-500 ${isLocked ? "opacity-30" : "opacity-100"}`}>
      {/* Tier label row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              isCompleted
                ? "bg-green-400"
                : isCurrent
                ? "bg-gold-400 animate-pulse"
                : "bg-mag-border"
            }`}
          />
          <span
            className={`text-xs font-display font-semibold tracking-wide ${
              isCompleted
                ? "text-green-400"
                : isCurrent
                ? "text-gold-400"
                : "text-mag-muted/50"
            }`}
          >
            {previousLabel} → {label}
          </span>
        </div>
        <span
          className={`text-xs font-body tabular-nums ${
            isCompleted
              ? "text-green-400"
              : isCurrent
              ? "text-gold-400"
              : "text-mag-muted/50"
          }`}
        >
          {isCompleted
            ? "100%"
            : isCurrent
            ? `${progressInTier.toFixed(1)}%`
            : isLocked
            ? "Locked"
            : "0%"}
        </span>
      </div>

      {/* Bar */}
      <div
        className={`relative h-3 sm:h-3.5 rounded-full overflow-hidden ${
          isLocked
            ? "bg-mag-border/40"
            : "bg-mag-gray border border-mag-border"
        }`}
      >
        {isCompleted ? (
          <div className="h-full w-full rounded-full bg-gradient-to-r from-green-500/80 to-green-400/80" />
        ) : isCurrent ? (
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ width: barWidth }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 20%, transparent 40%, rgba(255,255,255,0.15) 60%, transparent 80%, rgba(255,255,255,0.2) 100%)",
                backgroundSize: "200% 100%",
                animation: "fluidWave 3s ease-in-out infinite",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(180,140,20,0.4) 30%, transparent 50%, rgba(180,140,20,0.3) 70%, transparent 100%)",
                backgroundSize: "300% 100%",
                animation: "fluidWave 5s ease-in-out infinite reverse",
              }}
            />
            <div
              className="absolute inset-y-0 w-[30%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 70%)",
                animation: "fluidBubble 4s ease-in-out infinite",
              }}
            />
          </motion.div>
        ) : null}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1 opacity-30">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-px h-2 bg-mag-muted rounded-full" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Radial log gauge (merged in from the former standalone FlippeningGauge) ──
const GAUGE_MIN = 1_000_000; // $1M floor for the log scale
const GAUGE_R = 88;
const GAUGE_C = 2 * Math.PI * GAUGE_R;
const GAUGE_TRACK = GAUGE_C * 0.75; // 270° open-bottom gauge

function GaugeDial({
  marketCap,
  sp500MarketCap,
}: {
  marketCap: number;
  sp500MarketCap: number;
}) {
  const logProgress =
    marketCap > GAUGE_MIN && sp500MarketCap > GAUGE_MIN
      ? Math.max(
          0,
          Math.min(
            100,
            ((Math.log10(marketCap) - Math.log10(GAUGE_MIN)) /
              (Math.log10(sp500MarketCap) - Math.log10(GAUGE_MIN))) *
              100,
          ),
        )
      : 0;
  const progDash = (GAUGE_TRACK * logProgress) / 100;

  return (
    <div className="relative h-[220px] w-[220px] shrink-0 sm:h-[260px] sm:w-[260px]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E1C872" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C6F22" />
          </linearGradient>
        </defs>
        <g transform="rotate(135 100 100)">
          <circle
            cx={100}
            cy={100}
            r={GAUGE_R}
            fill="none"
            stroke="rgba(212,175,55,0.12)"
            strokeWidth={10}
            strokeDasharray={`${GAUGE_TRACK} ${GAUGE_C}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx={100}
            cy={100}
            r={GAUGE_R}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={10}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${GAUGE_C}` }}
            animate={{ strokeDasharray: `${progDash} ${GAUGE_C}` }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.4))" }}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gold-400/70">
          SPX6900 Market Cap
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-gold-static sm:text-3xl">
          <CountUp value={marketCap} format={formatCurrency} />
        </p>
        <p className="mt-2 font-body text-xs text-mag-muted">
          of the S&amp;P 500&apos;s{" "}
          <span className="text-white">{formatCurrency(sp500MarketCap)}</span>
        </p>
        <p className="mt-1 font-display text-[10px] uppercase tracking-wider text-gold-400/50">
          {logProgress.toFixed(0)}% there &middot; log scale
        </p>
      </div>
    </div>
  );
}

export default function FlippeningTracker({
  withGauge = false,
}: {
  /** Show the radial log gauge alongside the milestone breakdown (Data page). */
  withGauge?: boolean;
} = {}) {
  const router = useRouter();
  const { marketCap, sp500MarketCap, loading, error } = usePrice();
  const [showLocked, setShowLocked] = useState(false);
  // Client-side rolling buffer — the price API has no history (see hook docs).
  const mcSeries = useRollingSeries("spx-mc-series", marketCap);

  const percentage =
    sp500MarketCap > 0 ? (marketCap / sp500MarketCap) * 100 : 0;
  const multiplierNeeded =
    marketCap > 0 ? sp500MarketCap / marketCap : Infinity;

  // Final milestone tracks the live S&P 500 market cap (updated once a day).
  const tiers = useMemo(() => buildTiers(sp500MarketCap), [sp500MarketCap]);

  const { currentTierIdx, progressInTier, currentTierLabel, previousTierLabel } =
    getTierProgress(marketCap, tiers);

  const lockedCount = tiers.length - currentTierIdx - 1;

  // ── Milestone celebration ───────────────────────────────────────────────────
  // Fire once per browser when the tier advances past what we last recorded, so
  // a returning visitor sees each newly-crossed milestone exactly once. The first
  // visit records a silent baseline — merely arriving is not an "advance".
  const [celebrateLabel, setCelebrateLabel] = useState<string | null>(null);
  useEffect(() => {
    if (loading || error) return;
    const observedTier = currentTierIdx;
    let stored: number | null;
    try {
      const raw = localStorage.getItem(CELEBRATED_TIER_KEY);
      stored = raw === null ? null : parseInt(raw, 10);
    } catch {
      return; // localStorage unavailable — skip gracefully
    }
    if (stored === null || Number.isNaN(stored)) {
      try {
        localStorage.setItem(CELEBRATED_TIER_KEY, String(observedTier));
      } catch {}
      return;
    }
    if (observedTier > stored && observedTier > 0) {
      // Deliberate: fire the one-time milestone celebration when the tier
      // advances past the stored baseline (depends on localStorage, so it can't
      // be derived during render).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCelebrateLabel(tiers[observedTier - 1].label);
      try {
        localStorage.setItem(CELEBRATED_TIER_KEY, String(observedTier));
      } catch {}
    }
  }, [loading, error, currentTierIdx, tiers]);

  // Market-cap comparison header — only shown without the gauge (homepage). On
  // the Data page the gauge's centre already carries the market cap + S&P target,
  // so repeating it here would be the duplication we're merging away.
  const marketCapHeader = (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <p className="text-mag-muted text-[11px] sm:text-sm font-body uppercase tracking-wider">
          SPX6900 Market Cap
        </p>
        <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent truncate">
          <CountUp value={marketCap} format={formatCurrency} />
        </p>
        <Sparkline data={mcSeries} className="mt-2" />
      </div>
      <div className="sm:text-right min-w-0">
        <p className="text-mag-muted text-[11px] sm:text-sm font-body uppercase tracking-wider">
          S&P 500 Market Cap
        </p>
        <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
          {formatCurrency(sp500MarketCap)}
        </p>
      </div>
    </div>
  );

  // The milestone breakdown (accordion + tier bars + stats) — shared by both
  // layouts.
  const milestone = (
    <>
          {/* Current milestone — clickable to toggle locked tiers */}
          <button
            data-accordion
            onClick={(e) => {
              e.stopPropagation();
              setShowLocked((v) => !v);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/5 border border-gold-400/15 hover:bg-gold-400/10 transition-colors"
          >
            <span className="text-gold-400 text-sm">▸</span>
            <p className="text-xs sm:text-sm text-mag-muted font-body flex-1 text-left">
              Current milestone:{" "}
              <span className="text-gold-400 font-semibold font-display">
                {previousTierLabel} → {currentTierLabel}
              </span>
              <span className="hidden sm:inline text-mag-muted ml-1">
                ({progressInTier.toFixed(1)}% complete)
              </span>
            </p>
            {lockedCount > 0 && (
              <div className="flex items-center gap-1 text-mag-muted">
                <span className="text-[10px] sm:text-xs">
                  {lockedCount} more
                </span>
                <motion.div
                  animate={{ rotate: showLocked ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              </div>
            )}
          </button>

          {/* Completed + Current tier bars (always visible) */}
          <div className="space-y-3 sm:space-y-4">
            {tiers.slice(0, currentTierIdx + 1).map((tier, idx) => (
              <TierBar
                key={tier.label}
                tierIdx={idx}
                currentTierIdx={currentTierIdx}
                progressInTier={progressInTier}
                label={tier.label}
                previousLabel={idx === 0 ? "$0" : tiers[idx - 1].label}
              />
            ))}
          </div>

          {/* Locked tier bars (accordion) */}
          <AnimatePresence>
            {showLocked && lockedCount > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-3 sm:space-y-4 pt-1">
                  {tiers.slice(currentTierIdx + 1).map((tier, i) => {
                    const idx = currentTierIdx + 1 + i;
                    return (
                      <TierBar
                        key={tier.label}
                        tierIdx={idx}
                        currentTierIdx={currentTierIdx}
                        progressInTier={progressInTier}
                        label={tier.label}
                        previousLabel={tiers[idx - 1].label}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="px-3 py-2 rounded-lg bg-mag-gray border border-mag-border flex items-center justify-between sm:justify-start gap-2">
              <span className="text-xs sm:text-sm text-mag-muted font-body">
                Overall progress
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-gold-400 tabular-nums">
                {percentage.toFixed(percentage < 0.01 ? 6 : 4)}%
              </span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-mag-gray border border-mag-border flex items-center justify-between sm:justify-start gap-2">
              <span className="text-xs sm:text-sm text-mag-muted font-body">
                Multiplier needed
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-gold-400 tabular-nums">
                {multiplierNeeded === Infinity
                  ? "---"
                  : `${formatMultiplier(multiplierNeeded)}x`}
              </span>
            </div>
          </div>
    </>
  );

  return (
    <div
      onClick={
        withGauge
          ? undefined
          : (e) => {
              // Don't navigate if clicking the accordion toggle
              if ((e.target as HTMLElement).closest("[data-accordion]")) return;
              router.push("/data");
            }
      }
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gold-400/20 bg-[rgba(20,20,20,0.6)] p-4 backdrop-blur-xl transition-all duration-300 sm:p-6 md:p-8",
        !withGauge &&
          "cursor-pointer hover:border-gold-400/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]",
      )}
    >
      {celebrateLabel && (
        <FlippeningCelebration
          label={celebrateLabel}
          onDismiss={() => setCelebrateLabel(null)}
        />
      )}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <p className="text-red-400 text-center py-4">
          Unable to load market data. Please try again later.
        </p>
      ) : withGauge ? (
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex flex-col items-center">
            <GaugeDial marketCap={marketCap} sp500MarketCap={sp500MarketCap} />
            <Sparkline data={mcSeries} className="mt-3" />
          </div>
          <div className="w-full min-w-0 flex-1 space-y-5 sm:space-y-6">
            {milestone}
          </div>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {marketCapHeader}
          {milestone}
        </div>
      )}
    </div>
  );
}
