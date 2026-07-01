"use client";

import { motion } from "framer-motion";
import { usePrice } from "@/hooks/usePrice";
import CountUp from "@/components/widgets/CountUp";

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(value).toLocaleString()}`;
}

const MIN = 1_000_000; // $1M floor for the log scale
const R = 88;
const C = 2 * Math.PI * R;
const GAUGE = 0.75; // 270° open-bottom gauge
const TRACK = C * GAUGE;

export default function FlippeningGauge() {
  const { marketCap, sp500MarketCap, loading, error } = usePrice();

  const logProgress =
    marketCap > MIN && sp500MarketCap > MIN
      ? Math.max(
          0,
          Math.min(
            100,
            ((Math.log10(marketCap) - Math.log10(MIN)) /
              (Math.log10(sp500MarketCap) - Math.log10(MIN))) *
              100
          )
        )
      : 0;

  const progDash = (TRACK * logProgress) / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[240px] w-[240px] sm:h-[280px] sm:w-[280px]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E1C872" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C6F22" />
            </linearGradient>
          </defs>
          <g transform="rotate(135 100 100)">
            {/* Track */}
            <circle
              cx={100}
              cy={100}
              r={R}
              fill="none"
              stroke="rgba(212,175,55,0.12)"
              strokeWidth={10}
              strokeDasharray={`${TRACK} ${C}`}
              strokeLinecap="round"
            />
            {/* Progress */}
            <motion.circle
              cx={100}
              cy={100}
              r={R}
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth={10}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${C}` }}
              animate={{ strokeDasharray: `${progDash} ${C}` }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.4))" }}
            />
          </g>
        </svg>

        {/* Center readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {loading ? (
            <div className="h-8 w-28 animate-pulse rounded bg-mag-border" />
          ) : error ? (
            <p className="text-sm text-red-400">Data unavailable</p>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400/70 font-display">
                SPX6900 Market Cap
              </p>
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-gold-gradient">
                <CountUp value={marketCap} format={formatCurrency} />
              </p>
              <p className="mt-2 text-xs text-mag-muted font-body">
                of the S&amp;P 500&apos;s{" "}
                <span className="text-white">{formatCurrency(sp500MarketCap)}</span>
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-gold-400/50 font-display">
                {logProgress.toFixed(0)}% there · log scale
              </p>
            </>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-mag-muted text-center max-w-xs">
        Distance to the flippening on a logarithmic scale — every ring of gold is
        another order of magnitude.
      </p>
    </div>
  );
}
