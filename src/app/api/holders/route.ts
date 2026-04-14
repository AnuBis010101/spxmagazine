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

// ── In-memory cache (hot path — sub-ms reads) ───────────────────────────────

let memoryCache: HoldersPayload | null = null;

function getMemoryCache(): HoldersPayload | null {
  return memoryCache;
}

// ── Database persistence (Supabase site_settings) ────────────────────────────
//
// Stores holder counts in the `site_settings` table under key "holder_counts".
// This survives server restarts, deployments, and cold starts.
// The background refresh writes here; the GET handler reads from memory first,
// then falls back to DB on cold start.
// ─────────────────────────────────────────────────────────────────────────────

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
  } catch {
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
  } catch (e) {
    console.error("[holders] Failed to save to database:", e);
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
  const data = await safeFetch(
    `https://api.dexscreener.com/latest/dex/tokens/${BASE_ADDR}`,
    {},
    "dexscreener-base",
    10_000
  );
  const pairs = (data as any)?.pairs;
  if (!Array.isArray(pairs) || pairs.length === 0) return null;
  const price = parseFloat(pairs[0].priceUsd);
  return Number.isFinite(price) && price > 0 ? price : null;
}

async function fetchHoldersPage(
  cursor?: BlockScoutPageParams
): Promise<{ items: BlockScoutHolder[]; next: BlockScoutPageParams | null }> {
  let url = `${BLOCKSCOUT_BASE_URL}/tokens/${BASE_ADDR}/holders`;
  if (cursor) {
    const params = new URLSearchParams({
      value: cursor.value,
      address_hash: cursor.address_hash,
      items_count: String(cursor.items_count),
    });
    url += `?${params}`;
  }

  const data = await safeFetch(url, {}, "blockscout-holders", 10_000);
  if (!data) return { items: [], next: null };

  return {
    items: (data as any).items ?? [],
    next: (data as any).next_page_params ?? null,
  };
}

async function fetchBaseHolders(): Promise<ChainResult> {
  const base: ChainResult = {
    chain: "Base",
    holders: "N/A",
    address: BASE_ADDR,
    explorer: `https://basescan.org/token/${BASE_ADDR}`,
  };

  const price = await fetchBaseTokenPrice();
  if (!price) {
    console.warn("[holders] Base: no price, falling back to total count");
    const bs = await safeFetch(
      `${BLOCKSCOUT_BASE_URL}/tokens/${BASE_ADDR}`,
      {},
      "blockscout-base"
    );
    const bsCount = extractCount((bs as any)?.holders_count);
    if (bsCount !== null) return { ...base, holders: bsCount };
    return base;
  }

  const minTokens = MIN_HOLDING_USD / price;
  const minRaw = BigInt(Math.ceil(minTokens * 10 ** BASE_DECIMALS));
  console.log(
    `[holders] Base: price=$${price}, min $${MIN_HOLDING_USD} = ${minTokens.toFixed(2)} tokens (raw: ${minRaw})`
  );

  let qualifiedCount = 0;
  let cursor: BlockScoutPageParams | undefined = undefined;
  let pagesFetched = 0;
  let done = false;

  while (!done && pagesFetched < MAX_PAGES) {
    const { items, next } = await fetchHoldersPage(cursor);
    if (items.length === 0) break;

    for (const holder of items) {
      if (BigInt(holder.value) >= minRaw) {
        qualifiedCount++;
      } else {
        done = true;
        break;
      }
    }

    pagesFetched++;
    if (!next || done) break;
    cursor = next;

    if (pagesFetched % 100 === 0) {
      console.log(
        `[holders] Base: ${pagesFetched} pages, ${qualifiedCount} qualified so far`
      );
    }
  }

  console.log(
    `[holders] Base: ${qualifiedCount} holders above $${MIN_HOLDING_USD} (${pagesFetched} pages scanned)`
  );

  if (qualifiedCount > 0) return { ...base, holders: qualifiedCount };

  console.error("[holders] Base: filtering returned 0, falling back");
  return base;
}

// ── Background refresh (runs every 8h, writes to DB + memory) ────────────────

const REFRESH_INTERVAL = 8 * 60 * 60 * 1000; // 8 hours

let isRefreshing = false;

async function refreshHolders(): Promise<void> {
  if (isRefreshing) {
    console.log("[holders] Refresh already in progress, skipping");
    return;
  }

  isRefreshing = true;
  const start = Date.now();
  console.log("[holders] Background refresh started");

  try {
    const [ethereum, solana, base] = await Promise.all([
      fetchEthereumHolders(),
      fetchSolanaHolders(),
      fetchBaseHolders(),
    ]);

    const payload: HoldersPayload = {
      holders: [ethereum, solana, base],
      lastUpdated: new Date().toISOString(),
    };

    // Write to memory (instant reads)
    memoryCache = payload;

    // Write to database (survives restarts/deploys)
    await saveToDatabase(payload);

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(
      `[holders] Background refresh complete in ${elapsed}s — ` +
        `ETH: ${ethereum.holders}, SOL: ${solana.holders}, BASE: ${base.holders}`
    );
  } catch (error) {
    console.error("[holders] Background refresh failed:", error);
  } finally {
    isRefreshing = false;
  }
}

// On module load: hydrate memory from DB, then start background refresh cycle
(async () => {
  // 1. Hydrate memory from DB immediately (instant cold-start reads)
  const dbData = await loadFromDatabase();
  if (dbData) {
    memoryCache = dbData;
    console.log(
      `[holders] Hydrated from DB (last updated: ${dbData.lastUpdated})`
    );
  }

  // 2. Fire first background refresh (non-blocking)
  refreshHolders();

  // 3. Schedule recurring refreshes every 8 hours
  setInterval(refreshHolders, REFRESH_INTERVAL);
})();

// ── Route handler (always instant) ───────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const force = request.nextUrl.searchParams.get("force") === "1";

    if (force) {
      refreshHolders(); // fire-and-forget
    }

    // 1. Serve from memory (sub-ms)
    const cached = getMemoryCache();
    if (cached) {
      return NextResponse.json(cached);
    }

    // 2. Memory empty (cold start) — try DB directly
    const dbData = await loadFromDatabase();
    if (dbData) {
      memoryCache = dbData;
      return NextResponse.json(dbData);
    }

    // 3. Absolute first deploy — no data anywhere yet
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
