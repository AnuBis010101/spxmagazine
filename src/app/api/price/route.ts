import { NextResponse } from "next/server";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=spx6900&vs_currencies=usd&include_24hr_change=true&include_market_cap=true";

/** Approximate S&P 500 total market cap in USD */
const SP500_MARKET_CAP = 50_000_000_000_000; // ~$50 trillion

const CACHE_TTL_MS = 60_000; // 60 seconds

interface CachedData {
  price: number;
  change24h: number;
  marketCap: number;
  spx6900MarketCap: number;
  sp500MarketCap: number;
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
      sp500MarketCap: SP500_MARKET_CAP,
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

export async function GET() {
  try {
    const data = await fetchPrice();

    return NextResponse.json(
      {
        price: data.price,
        change24h: data.change24h,
        marketCap: data.marketCap,
        spx6900MarketCap: data.spx6900MarketCap,
        sp500MarketCap: data.sp500MarketCap,
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
