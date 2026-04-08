import { NextRequest, NextResponse } from "next/server";

// ── Cache ─────────────────────────────────────────────────────────────────────
const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 hours — 3× per day

interface ChainResult {
  chain: string;
  holders: number | "N/A";
  address: string;
  explorer: string;
}

interface CacheEntry {
  data: { holders: ChainResult[]; lastUpdated: string };
  timestamp: number;
}

let cache: CacheEntry | null = null;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse any holder-count value into a positive integer.
 * Handles: number, "49345", "49,345", "49 345", null, undefined, 0, NaN.
 * Returns null for anything that isn't a real positive integer.
 */
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

/**
 * Fetch JSON with timeout. Returns null on any failure.
 */
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

  // Source 1: BlockScout (free, no key)
  const bs = await safeFetch(
    `https://eth.blockscout.com/api/v2/tokens/${ETH_ADDR}`,
    {},
    "blockscout-eth"
  );
  const bsCount = extractCount((bs as any)?.holders_count);
  if (bsCount !== null) {
    return { ...base, holders: bsCount };
  }

  console.error("[holders] Ethereum: all sources failed");
  return base;
}

// ── Solana ────────────────────────────────────────────────────────────────────
//
// Strategy: Use Solana RPC `getProgramAccounts` directly on the blockchain.
// This is the exact same method block explorers (Solscan, etc.) use internally.
// - FREE: public RPC, no API key needed
// - ACCURATE: counts actual non-zero balance token accounts
// - RELIABLE: multiple RPC fallbacks, the blockchain is always available
//
// The call fetches only the 8-byte `amount` field from each SPL Token account
// matching the SPX6900 mint, then counts how many have a non-zero balance.
// Response is ~39 MB for ~165K accounts — fine for a function running 3× per day.
// ─────────────────────────────────────────────────────────────────────────────

const SOL_MINT = "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr";

const SOLANA_RPCS = [
  "https://api.mainnet-beta.solana.com",
  "https://rpc.ankr.com/solana",
];

// Pre-built RPC request body (same for every call)
const SOL_RPC_BODY = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "getProgramAccounts",
  params: [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token Program
    {
      encoding: "base64",
      dataSlice: { offset: 64, length: 8 }, // only the uint64 `amount` field
      filters: [
        { dataSize: 165 }, // standard SPL token account size
        { memcmp: { offset: 0, bytes: SOL_MINT } }, // filter by mint
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
      const timer = setTimeout(() => controller.abort(), 45_000); // generous timeout

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

      // Count accounts whose 8-byte amount is non-zero
      let active = 0;
      for (const acc of accounts) {
        const b64 = acc.account.data[0];
        const bytes = Buffer.from(b64, "base64");
        // Any non-zero byte ⇒ balance > 0
        for (let i = 0; i < bytes.length; i++) {
          if (bytes[i] !== 0) {
            active++;
            break;
          }
        }
      }

      if (active > 0) {
        return { ...fallback, holders: active };
      }
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

// ── Base ──────────────────────────────────────────────────────────────────────

const BASE_ADDR = "0x50dA645f148798F68EF2d7dB7C1CB22A6819bb2C";

async function fetchBaseHolders(): Promise<ChainResult> {
  const base: ChainResult = {
    chain: "Base",
    holders: "N/A",
    address: BASE_ADDR,
    explorer: `https://basescan.org/token/${BASE_ADDR}`,
  };

  // Source 1: BlockScout Base (free, no key)
  const bs = await safeFetch(
    `https://base.blockscout.com/api/v2/tokens/${BASE_ADDR}`,
    {},
    "blockscout-base"
  );
  const bsCount = extractCount((bs as any)?.holders_count);
  if (bsCount !== null) {
    return { ...base, holders: bsCount };
  }

  console.error("[holders] Base: all sources failed");
  return base;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const force = request.nextUrl.searchParams.get("force") === "1";

    if (!force && cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    const [ethereum, solana, base] = await Promise.all([
      fetchEthereumHolders(),
      fetchSolanaHolders(),
      fetchBaseHolders(),
    ]);

    const result = {
      holders: [ethereum, solana, base],
      lastUpdated: new Date().toISOString(),
    };

    cache = { data: result, timestamp: Date.now() };
    return NextResponse.json(result);
  } catch (error) {
    console.error("[holders] Fatal error:", error);
    return NextResponse.json(
      { error: "Failed to fetch holder data" },
      { status: 500 }
    );
  }
}
