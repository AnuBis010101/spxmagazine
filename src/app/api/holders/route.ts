import { NextRequest, NextResponse } from "next/server";

// ── Types ────────────────────────────────────────────────────────────────────

interface ChainResult {
  chain: string;
  holders: number | "N/A";
  address: string;
  explorer: string;
}

interface HoldersPayload {
  holders: ChainResult[];
  lastUpdated: string;
}

// ── Config ───────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min for full refresh

const STALE_AFTER_MS = 9 * 60 * 60 * 1000; // 9 hours — triggers background refresh

// ── Database persistence (Supabase site_settings) ────────────────────────────

async function loadFromDatabase(): Promise<HoldersPayload | null> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "holder_counts")
      .single();

    if (error || !data?.value) return null;
    return data.value as HoldersPayload;
  } catch (e) {
    console.error("[holders] DB load failed:", e);
    return null;
  }
}

async function saveToDatabase(payload: HoldersPayload): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase
      .from("site_settings")
      .upsert(
        { key: "holder_counts", value: payload, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    console.log("[holders] Saved to database");
  } catch (e) {
    console.error("[holders] DB save failed:", e);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractCount(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  let n: number;
  if (typeof raw === "number") {
    n = Math.trunc(raw);
  } else if (typeof raw === "string") {
    const cleaned = raw.trim().replace(/[\s,_]/g, "");
    if (!cleaned || cleaned === "N/A" || cleaned === "null") return null;
    n = parseInt(cleaned, 10);
  } else {
    return null;
  }
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function safeFetch(
  url: string,
  options: RequestInit = {},
  label = "",
  timeoutMs = 8_000
): Promise<unknown> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`[holders] ${label || url} → HTTP ${res.status}`);
      return null;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.warn(`[holders] ${label || url} → non-JSON body`);
      return null;
    }
  } catch (err: any) {
    const reason =
      err?.name === "AbortError"
        ? "timeout"
        : (err?.message ?? "network error");
    console.warn(`[holders] ${label || url} → ${reason}`);
    return null;
  }
}

// ── Ethereum ──────────────────────────────────────────────────────────────────

const ETH_ADDR = "0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c";

async function fetchEthereumHolders(): Promise<ChainResult> {
  const base: ChainResult = {
    chain: "Ethereum",
    holders: "N/A",
    address: ETH_ADDR,
    explorer: `https://etherscan.io/token/${ETH_ADDR}`,
  };

  const bs = await safeFetch(
    `https://eth.blockscout.com/api/v2/tokens/${ETH_ADDR}`,
    {},
    "blockscout-eth"
  );
  const bsCount = extractCount((bs as any)?.holders_count);
  if (bsCount !== null) return { ...base, holders: bsCount };

  console.error("[holders] Ethereum: all sources failed");
  return base;
}

// ── Solana ────────────────────────────────────────────────────────────────────

const SOL_MINT = "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr";

const SOLANA_RPCS = [
  "https://api.mainnet-beta.solana.com",
  "https://rpc.ankr.com/solana",
];

const SOL_RPC_BODY = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "getProgramAccounts",
  params: [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    {
      encoding: "base64",
      dataSlice: { offset: 64, length: 8 },
      filters: [
        { dataSize: 165 },
        { memcmp: { offset: 0, bytes: SOL_MINT } },
      ],
    },
  ],
});

async function fetchSolanaHolders(): Promise<ChainResult> {
  const fallback: ChainResult = {
    chain: "Solana",
    holders: "N/A",
    address: SOL_MINT,
    explorer: `https://solscan.io/token/${SOL_MINT}`,
  };

  for (const rpc of SOLANA_RPCS) {
    const host = new URL(rpc).hostname;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45_000);

      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: SOL_RPC_BODY,
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timer);

      if (!res.ok) {
        console.warn(`[holders] solana-rpc (${host}) → HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();

      if (data.error) {
        console.warn(
          `[holders] solana-rpc (${host}) → RPC error: ${data.error.message ?? JSON.stringify(data.error)}`
        );
        continue;
      }

      const accounts: { account: { data: [string, string] } }[] =
        data.result ?? [];

      if (accounts.length === 0) {
        console.warn(`[holders] solana-rpc (${host}) → 0 accounts returned`);
        continue;
      }

      let active = 0;
      for (const acc of accounts) {
        const b64 = acc.account.data[0];
        const bytes = Buffer.from(b64, "base64");
        for (let i = 0; i < bytes.length; i++) {
          if (bytes[i] !== 0) {
            active++;
            break;
          }
        }
      }

      if (active > 0) return { ...fallback, holders: active };
    } catch (err: any) {
      const reason =
        err?.name === "AbortError"
          ? "timeout"
          : (err?.message ?? "network error");
      console.warn(`[holders] solana-rpc (${host}) → ${reason}`);
    }
  }

  console.error("[holders] Solana: all RPC endpoints failed");
  return fallback;
}

// ── Base (filtered: $2 minimum) ──────────────────────────────────────────────
//
// IMPORTANT: This function NEVER returns the unfiltered total count.
// If price is unavailable or pagination is interrupted, it returns "N/A"
// so the merge logic preserves the previous curated value from the DB.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_ADDR = "0x50dA645f148798F68EF2d7dB7C1CB22A6819bb2C";
const BASE_DECIMALS = 8;
const MIN_HOLDING_USD = 2;
const BLOCKSCOUT_BASE_URL = "https://base.blockscout.com/api/v2";
const MAX_PAGES = 5000;

interface BlockScoutHolder {
  address: { hash: string };
  value: string;
}

interface BlockScoutPageParams {
  value: string;
  address_hash: string;
  items_count: number;
}

async function fetchBaseTokenPrice(): Promise<number | null> {
  // Try DexScreener first
  const data = await safeFetch(
    `https://api.dexscreener.com/latest/dex/tokens/${BASE_ADDR}`,
    {},
    "dexscreener-base",
    10_000
  );
  const pairs = (data as any)?.pairs;
  if (Array.isArray(pairs) && pairs.length > 0) {
    const price = parseFloat(pairs[0].priceUsd);
    if (Number.isFinite(price) && price > 0) return price;
  }

  // Try CoinGecko as backup
  const cg = await safeFetch(
    "https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=" +
      BASE_ADDR +
      "&vs_currencies=usd",
    {},
    "coingecko-base",
    10_000
  );
  const cgPrice = (cg as any)?.[BASE_ADDR.toLowerCase()]?.usd;
  if (typeof cgPrice === "number" && cgPrice > 0) return cgPrice;

  return null;
}

async function fetchHoldersPage(
  cursor?: BlockScoutPageParams
): Promise<{ items: BlockScoutHolder[]; next: BlockScoutPageParams | null; failed: boolean }> {
  let url = `${BLOCKSCOUT_BASE_URL}/tokens/${BASE_ADDR}/holders`;
  if (cursor) {
    const params = new URLSearchParams({
      value: cursor.value,
      address_hash: cursor.address_hash,
      items_count: String(cursor.items_count),
    });
    url += `?${params}`;
  }

  // Retry up to 3 times with exponential backoff
  for (let attempt = 1; attempt <= 3; attempt++) {
    const data = await safeFetch(url, {}, "blockscout-holders", 15_000);
    if (data) {
      return {
        items: (data as any).items ?? [],
        next: (data as any).next_page_params ?? null,
        failed: false,
      };
    }
    if (attempt < 3) {
      console.warn(`[holders] Base page fetch failed, retry ${attempt}/3`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }

  return { items: [], next: null, failed: true };
}

async function fetchBaseHolders(): Promise<ChainResult> {
  const base: ChainResult = {
    chain: "Base",
    holders: "N/A",
    address: BASE_ADDR,
    explorer: `https://basescan.org/token/${BASE_ADDR}`,
  };

  // ── Step 1: Get live price (REQUIRED for curation) ──
  const price = await fetchBaseTokenPrice();
  if (!price) {
    // CRITICAL: Do NOT fall back to unfiltered count.
    // Return "N/A" so merge logic preserves the previous curated value.
    console.error("[holders] Base: price unavailable — returning N/A to preserve curated count");
    return base;
  }

  // ── Step 2: Calculate minimum raw token amount for $2 threshold ──
  const minTokens = MIN_HOLDING_USD / price;
  const minRaw = BigInt(Math.ceil(minTokens * 10 ** BASE_DECIMALS));
  console.log(
    `[holders] Base: price=$${price.toFixed(6)}, min $${MIN_HOLDING_USD} = ${minTokens.toFixed(2)} tokens (raw: ${minRaw})`
  );

  // ── Step 3: Paginate through holders (sorted descending by balance) ──
  let qualifiedCount = 0;
  let cursor: BlockScoutPageParams | undefined = undefined;
  let pagesFetched = 0;
  let completedNormally = false;

  while (pagesFetched < MAX_PAGES) {
    const { items, next, failed } = await fetchHoldersPage(cursor);

    if (failed) {
      console.error(
        `[holders] Base: page fetch failed after retries at page ${pagesFetched + 1}, aborting`
      );
      break;
    }

    if (items.length === 0) {
      // Legitimate end of data — all holders are above threshold
      completedNormally = true;
      break;
    }

    let foundBoundary = false;
    for (const holder of items) {
      if (BigInt(holder.value) >= minRaw) {
        qualifiedCount++;
      } else {
        foundBoundary = true;
        break;
      }
    }

    pagesFetched++;

    if (foundBoundary) {
      completedNormally = true;
      break;
    }

    if (!next) {
      completedNormally = true;
      break;
    }

    cursor = next;

    if (pagesFetched % 100 === 0) {
      console.log(
        `[holders] Base: ${pagesFetched} pages, ${qualifiedCount} qualified so far`
      );
    }
  }

  console.log(
    `[holders] Base: ${qualifiedCount} holders above $${MIN_HOLDING_USD} (${pagesFetched} pages, ${completedNormally ? "complete" : "INTERRUPTED"})`
  );

  // Only return a count if pagination completed AND we got a reasonable number
  if (completedNormally && qualifiedCount > 0) {
    return { ...base, holders: qualifiedCount };
  }

  // Pagination interrupted or zero count — return "N/A" to preserve previous curated value
  if (!completedNormally) {
    console.error("[holders] Base: pagination interrupted — returning N/A to preserve previous data");
  } else {
    console.error("[holders] Base: qualified count is 0 despite completion — returning N/A");
  }
  return base;
}

// ── Refresh logic ────────────────────────────────────────────────────────────
//
// Called on-demand by GET ?refresh=1 or by Vercel cron.
// Fetches all 3 chains in parallel, merges with previous DB data
// (preserving curated values when a chain returns "N/A"),
// and persists to Supabase.
// ─────────────────────────────────────────────────────────────────────────────

let refreshPromise: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
  const start = Date.now();
  console.log("[holders] ═══ Refresh started ═══");

  // Load previous data from DB (source of truth on serverless)
  const previous = await loadFromDatabase();

  // Fetch all three chains in parallel
  const [ethereum, solana, base] = await Promise.all([
    fetchEthereumHolders(),
    fetchSolanaHolders(),
    fetchBaseHolders(),
  ]);

  const freshResults = [ethereum, solana, base];

  // Merge: keep previous curated value for any chain that returned "N/A"
  let hasNewData = false;
  const merged = freshResults.map((result) => {
    if (result.holders !== "N/A") {
      hasNewData = true;
      return result;
    }
    // Chain returned "N/A" — preserve previous value from DB
    const prev = previous?.holders.find((h) => h.chain === result.chain);
    if (prev && prev.holders !== "N/A") {
      console.log(
        `[holders] ${result.chain}: keeping previous curated value ${prev.holders} (refresh returned N/A)`
      );
      return { ...result, holders: prev.holders };
    }
    // No previous value either — stays "N/A"
    return result;
  });

  // Build payload — only update timestamp when we actually got new data
  const now = new Date().toISOString();
  const payload: HoldersPayload = {
    holders: merged,
    lastUpdated: hasNewData
      ? now
      : previous?.lastUpdated ?? now,
  };

  // Persist to database (source of truth)
  await saveToDatabase(payload);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `[holders] ═══ Refresh complete in ${elapsed}s ═══\n` +
      `  ETH: ${merged[0].holders}\n` +
      `  SOL: ${merged[1].holders}\n` +
      `  BASE: ${merged[2].holders}\n` +
      `  hasNewData: ${hasNewData}\n` +
      `  lastUpdated: ${payload.lastUpdated}`
  );
}

/** Singleton guard: only one refresh at a time */
function refreshHolders(): Promise<void> {
  if (refreshPromise) {
    console.log("[holders] Refresh already in progress — reusing promise");
    return refreshPromise;
  }
  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

// ── Route handler ────────────────────────────────────────────────────────────
//
// GET /api/holders          → instant read from DB
// GET /api/holders?refresh=1 → trigger refresh, return current DB data immediately
// GET /api/holders?refresh=1&wait=1 → trigger refresh and wait for it (for cron)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const wantRefresh = params.get("refresh") === "1" || params.get("force") === "1";
    const waitForRefresh = params.get("wait") === "1";

    // If cron or manual trigger: refresh and optionally wait
    if (wantRefresh) {
      if (waitForRefresh) {
        // Cron job: wait for refresh to complete, then return fresh data
        await refreshHolders();
        const fresh = await loadFromDatabase();
        if (fresh) {
          return NextResponse.json(fresh);
        }
      } else {
        // Fire-and-forget refresh, return stale data immediately
        refreshHolders();
      }
    }

    // Serve from database (source of truth on serverless)
    const dbData = await loadFromDatabase();
    if (dbData) {
      // Check staleness — if data is too old, kick off a background refresh
      if (!wantRefresh && dbData.lastUpdated) {
        const age = Date.now() - new Date(dbData.lastUpdated).getTime();
        if (age > STALE_AFTER_MS) {
          console.log(
            `[holders] Data is ${(age / 3600000).toFixed(1)}h old — triggering background refresh`
          );
          refreshHolders(); // fire-and-forget
        }
      }
      return NextResponse.json(dbData);
    }

    // No data in DB at all (first-ever deploy)
    return NextResponse.json(
      { error: "Holder data not yet available, please retry shortly" },
      { status: 503 }
    );
  } catch (error) {
    console.error("[holders] Fatal error:", error);
    return NextResponse.json(
      { error: "Failed to fetch holder data" },
      { status: 500 }
    );
  }
}
