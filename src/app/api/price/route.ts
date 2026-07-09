import { NextResponse, after } from "next/server";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=spx6900&vs_currencies=usd&include_24hr_change=true&include_market_cap=true";

const CACHE_TTL_MS = 60_000; // 60 seconds (SPX6900 price)

// ── S&P 500 total market cap ────────────────────────────────────────────────
// There's no free single-number feed for the S&P 500's aggregate market cap, so
// we track the REAL live index level (updated once a day) and scale it by a
// "$ per index point" figure derived from a recent anchor. Result: the
// flippening target now moves with the real market every day instead of sitting
// on a frozen $50T. The per-point figure drifts slowly (rebalances, buybacks) —
// override it with the SP500_DIVISOR env var or refresh the anchor occasionally.
const SP500_DEFAULT = 50_000_000_000_000; // fallback if every source fails
// Anchor: ~$52.0T aggregate cap at an S&P 500 level of ~6,050 (mid-2025).
const SP500_CAP_PER_POINT =
  Number(process.env.SP500_DIVISOR) || 52_000_000_000_000 / 6050;
const SP500_DB_KEY = "sp500_market_cap";
const DAY_MS = 24 * 60 * 60 * 1000;

interface CachedData {
  price: number;
  change24h: number;
  marketCap: number;
  spx6900MarketCap: number;
  timestamp: number;
}

let cache: CachedData | null = null;

async function fetchPrice(): Promise<CachedData> {
  const now = Date.now();

  // Return cached data if still fresh
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache;
  }

  try {
    const res = await fetch(COINGECKO_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`CoinGecko responded with status ${res.status}`);
    }

    const data = await res.json();
    const spx = data.spx6900;

    if (!spx) {
      throw new Error("SPX6900 data missing from CoinGecko response");
    }

    cache = {
      price: spx.usd ?? 0,
      change24h: spx.usd_24h_change ?? 0,
      marketCap: spx.usd_market_cap ?? 0,
      spx6900MarketCap: spx.usd_market_cap ?? 0,
      timestamp: now,
    };

    return cache;
  } catch (error) {
    // If we have stale cached data, return it rather than failing
    if (cache) {
      return cache;
    }

    throw error;
  }
}

// ── S&P 500 live index → daily-cached market cap ────────────────────────────

interface Sp500Cache {
  cap: number;
  index: number;
  ts: number;
}

let sp500Cache: Sp500Cache | null = null;
let sp500Refreshing: Promise<void> | null = null;

/** Fetch the current S&P 500 index level. Stooq first (CSV, server-friendly),
 *  Yahoo Finance as a fallback. Throws only if both fail. */
async function fetchSp500Index(): Promise<number> {
  // Primary — Stooq light quote CSV
  try {
    const res = await fetch(
      "https://stooq.com/q/l/?s=%5Espx&f=sd2t2ohlcv&h&e=csv",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
    );
    if (res.ok) {
      const csv = (await res.text()).trim();
      const rows = csv.split("\n");
      const cols = rows[rows.length - 1].split(","); // Symbol,Date,Time,O,H,L,Close,Vol
      const close = parseFloat(cols[6]);
      if (Number.isFinite(close) && close > 1000) return close;
    }
  } catch {
    // fall through to Yahoo
  }

  // Fallback — Yahoo Finance chart
  const res = await fetch(
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=1d",
    { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
  );
  if (!res.ok) throw new Error(`Yahoo ^GSPC responded with status ${res.status}`);
  const json = await res.json();
  const level = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
  if (!Number.isFinite(level) || level <= 1000) {
    throw new Error("S&P 500 index level missing from Yahoo response");
  }
  return level;
}

async function loadSp500FromDb(): Promise<Sp500Cache | null> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SP500_DB_KEY)
      .single();
    if (error || !data?.value) return null;
    const v = data.value as { cap: number; index: number; updatedAt: string };
    const ts = Date.parse(v.updatedAt);
    if (!Number.isFinite(v.cap) || !Number.isFinite(ts)) return null;
    return { cap: v.cap, index: v.index, ts };
  } catch {
    return null;
  }
}

async function saveSp500ToDb(entry: Sp500Cache): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase.from("site_settings").upsert(
      {
        key: SP500_DB_KEY,
        value: {
          cap: entry.cap,
          index: entry.index,
          capPerPoint: SP500_CAP_PER_POINT,
          updatedAt: new Date(entry.ts).toISOString(),
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  } catch (e) {
    console.error("[api/price] S&P 500 DB save failed:", e);
  }
}

/** Refresh the S&P 500 cap from the live index (deduped across concurrent calls). */
function refreshSp500(): Promise<void> {
  if (sp500Refreshing) return sp500Refreshing;
  sp500Refreshing = (async () => {
    try {
      const index = await fetchSp500Index();
      const cap = Math.round(index * SP500_CAP_PER_POINT);
      const entry: Sp500Cache = { cap, index, ts: Date.now() };
      sp500Cache = entry;
      await saveSp500ToDb(entry);
      console.log(`[api/price] S&P 500 refreshed — index ${index}, cap ${cap}`);
    } catch (e) {
      console.error("[api/price] S&P 500 refresh failed:", e);
    } finally {
      sp500Refreshing = null;
    }
  })();
  return sp500Refreshing;
}

/** Return today's S&P 500 cap quickly (module cache → DB → default), flagging
 *  when a once-a-day refresh is due so the caller can run it in the background. */
async function resolveSp500(): Promise<{ cap: number; stale: boolean }> {
  const now = Date.now();
  if (sp500Cache && now - sp500Cache.ts < DAY_MS) {
    return { cap: sp500Cache.cap, stale: false };
  }
  if (!sp500Cache) {
    const db = await loadSp500FromDb();
    if (db) sp500Cache = db;
  }
  const fresh = !!sp500Cache && now - sp500Cache.ts < DAY_MS;
  return { cap: sp500Cache?.cap ?? SP500_DEFAULT, stale: !fresh };
}

export async function GET() {
  try {
    const data = await fetchPrice();
    const { cap: sp500MarketCap, stale } = await resolveSp500();

    // Refresh the S&P 500 cap at most once a day, after the response is sent.
    if (stale) after(refreshSp500);

    return NextResponse.json(
      {
        price: data.price,
        change24h: data.change24h,
        marketCap: data.marketCap,
        spx6900MarketCap: data.spx6900MarketCap,
        sp500MarketCap,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("[api/price] Failed to fetch price data:", error);

    return NextResponse.json(
      { error: "Failed to fetch price data" },
      { status: 502 }
    );
  }
}
