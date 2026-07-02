import { NextRequest, NextResponse, after } from "next/server";

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
  // Per-chain refresh telemetry — helps diagnose stale data without DB inspection
  lastAttempt?: {
    at: string;
    ethereum: { ok: boolean; reason?: string; durationMs?: number };
    solana: { ok: boolean; reason?: string; durationMs?: number };
    base: { ok: boolean; reason?: string; durationMs?: number; pages?: number };
  };
}

// ── Config ───────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min for full refresh

// Stale window — if the lastUpdated is older than this on a normal request,
// we kick a background refresh. Set tight enough that one missed cron run
// triggers self-healing on the very next page view.
const STALE_AFTER_MS = 7 * 60 * 60 * 1000; // 7 hours (cron runs every 6h)

// Hard wall-clock budget for the entire refresh — keep safely under maxDuration
// so we always have headroom to write to the DB before the function dies.
const REFRESH_BUDGET_MS = 270_000; // 4m30s
const PHASE_1_BUDGET_MS = 30_000; // ETH + SOL: 30s max
const BASE_DEADLINE_BUFFER_MS = 15_000; // leave 15s for the final DB write

const DB_KEY = "holder_counts";

// ── Database persistence (Supabase site_settings) ────────────────────────────

async function loadFromDatabase(): Promise<HoldersPayload | null> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", DB_KEY)
      .single();

    if (error || !data?.value) return null;
    return data.value as HoldersPayload;
  } catch (e) {
    console.error("[holders] DB load failed:", e);
    return null;
  }
}

async function saveToDatabase(payload: HoldersPayload): Promise<boolean> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: DB_KEY, value: payload, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) {
      console.error("[holders] DB save error:", error);
      return false;
    }
    console.log("[holders] Saved to database");
    return true;
  } catch (e) {
    console.error("[holders] DB save failed:", e);
    return false;
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
  } catch (err) {
    const e = err as { name?: string; message?: string } | null;
    const reason =
      e?.name === "AbortError"
        ? "timeout"
        : (e?.message ?? "network error");
    console.warn(`[holders] ${label || url} → ${reason}`);
    return null;
  }
}

/** Race a promise against a wall-clock timeout, surfacing a clean error. */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(
      () => reject(new Error(`${label} exceeded ${ms}ms`)),
      ms
    );
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

// ── Ethereum ──────────────────────────────────────────────────────────────────

const ETH_ADDR = "0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c";

const ETH_BASE: ChainResult = {
  chain: "Ethereum",
  holders: "N/A",
  address: ETH_ADDR,
  explorer: `https://etherscan.io/token/${ETH_ADDR}`,
};

async function fetchEthereumHolders(): Promise<ChainResult> {
  const bs = await safeFetch(
    `https://eth.blockscout.com/api/v2/tokens/${ETH_ADDR}`,
    {},
    "blockscout-eth"
  );
  const bsCount = extractCount((bs as { holders_count?: unknown } | null)?.holders_count);
  if (bsCount !== null) return { ...ETH_BASE, holders: bsCount };

  console.error("[holders] Ethereum: all sources failed");
  return ETH_BASE;
}

// ── Solana ────────────────────────────────────────────────────────────────────

const SOL_MINT = "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr";

const SOL_BASE: ChainResult = {
  chain: "Solana",
  holders: "N/A",
  address: SOL_MINT,
  explorer: `https://solscan.io/token/${SOL_MINT}`,
};

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
  for (const rpc of SOLANA_RPCS) {
    const host = new URL(rpc).hostname;
    try {
      const controller = new AbortController();
      // Cap each Solana RPC attempt at 25s — keeps us under PHASE_1_BUDGET_MS
      // even if both endpoints time out.
      const timer = setTimeout(() => controller.abort(), 25_000);

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

      if (active > 0) return { ...SOL_BASE, holders: active };
    } catch (err) {
      const e = err as { name?: string; message?: string } | null;
      const reason =
        e?.name === "AbortError"
          ? "timeout"
          : (e?.message ?? "network error");
      console.warn(`[holders] solana-rpc (${host}) → ${reason}`);
    }
  }

  console.error("[holders] Solana: all RPC endpoints failed");
  return SOL_BASE;
}

// ── Base ─────────────────────────────────────────────────────────────────────
// Counts ALL holders via Blockscout's total `holders_count` field — same as
// Ethereum. (Previously curated to a $2 minimum via slow balance-descending
// pagination; that exclusion has been removed.)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_ADDR = "0x50dA645f148798F68EF2d7dB7C1CB22A6819bb2C";
const BLOCKSCOUT_BASE_URL = "https://base.blockscout.com/api/v2";

const BASE_DEFAULT: ChainResult = {
  chain: "Base",
  holders: "N/A",
  address: BASE_ADDR,
  explorer: `https://basescan.org/token/${BASE_ADDR}`,
};

async function fetchBaseHolders(): Promise<{
  result: ChainResult;
  pages: number;
  reason?: string;
}> {
  // Count ALL holders via Blockscout's total holders_count — one fast request,
  // no pagination, no price, no $2 filtering (mirrors fetchEthereumHolders).
  const bs = await safeFetch(
    `${BLOCKSCOUT_BASE_URL}/tokens/${BASE_ADDR}`,
    {},
    "blockscout-base"
  );
  const bsCount = extractCount(
    (bs as { holders_count?: unknown } | null)?.holders_count
  );
  if (bsCount !== null) {
    return { result: { ...BASE_DEFAULT, holders: bsCount }, pages: 0 };
  }

  console.error("[holders] Base: holders_count unavailable");
  return { result: BASE_DEFAULT, pages: 0, reason: "holders_count unavailable" };
}

// ── Refresh logic ────────────────────────────────────────────────────────────
//
// Bulletproof design:
//   Phase 1: ETH + SOL in parallel (fast, ~5-15s total). Save to DB immediately.
//   Phase 2: Base (slow, can take minutes). Save to DB on completion.
//
// Even if Phase 2 hangs and gets killed by Vercel's function timeout,
// Phase 1's results are already persisted — so ETH/SOL keep refreshing
// reliably regardless of BlockScout-Base flakiness.
//
// Each phase is independently try/catch'd; one chain's failure cannot
// cascade into another chain's data being lost.
// ─────────────────────────────────────────────────────────────────────────────

let refreshPromise: Promise<void> | null = null;

async function mergePhaseAndSave(
  phaseResults: ChainResult[],
  reason: string
): Promise<void> {
  // Re-load latest DB state before each save so we don't clobber a sibling
  // phase's recent write (e.g. Base finishing while we were re-merging).
  const current = await loadFromDatabase();
  const previousByChain = new Map<string, ChainResult>(
    (current?.holders ?? []).map((h) => [h.chain, h])
  );

  // For chains we're updating in this phase: prefer fresh value, fall back
  // to previous DB value if "N/A".
  let hasNewData = false;
  for (const fresh of phaseResults) {
    if (fresh.holders !== "N/A") {
      previousByChain.set(fresh.chain, fresh);
      const prev = current?.holders.find((h) => h.chain === fresh.chain);
      if (!prev || prev.holders !== fresh.holders) hasNewData = true;
    } else {
      // Keep whatever we have — don't overwrite curated DB value with N/A
      const prev = previousByChain.get(fresh.chain);
      if (!prev) previousByChain.set(fresh.chain, fresh);
      console.log(
        `[holders] ${fresh.chain}: refresh returned N/A — preserving DB value (${prev?.holders ?? "none"})`
      );
    }
  }

  // Maintain canonical chain order
  const order = ["Ethereum", "Solana", "Base"];
  const merged: ChainResult[] = order
    .map((name) => previousByChain.get(name))
    .filter((x): x is ChainResult => Boolean(x));

  // Add any unexpected chains we didn't know about (shouldn't happen but safe)
  for (const [name, val] of previousByChain) {
    if (!order.includes(name)) merged.push(val);
  }

  const payload: HoldersPayload = {
    holders: merged,
    lastUpdated: hasNewData
      ? new Date().toISOString()
      : current?.lastUpdated ?? new Date().toISOString(),
    lastAttempt: current?.lastAttempt,
  };

  const ok = await saveToDatabase(payload);
  console.log(
    `[holders] ${reason} ${ok ? "saved" : "FAILED"} → ${merged.map((m) => `${m.chain}=${m.holders}`).join(", ")}`
  );
}

async function saveAttemptTelemetry(
  attempt: HoldersPayload["lastAttempt"]
): Promise<void> {
  const current = await loadFromDatabase();
  if (!current) return;
  await saveToDatabase({ ...current, lastAttempt: attempt });
}

async function doRefresh(): Promise<void> {
  const start = Date.now();
  const refreshDeadline = start + REFRESH_BUDGET_MS;
  console.log("[holders] ═══ Refresh started ═══");

  const attempt: NonNullable<HoldersPayload["lastAttempt"]> = {
    at: new Date().toISOString(),
    ethereum: { ok: false },
    solana: { ok: false },
    base: { ok: false },
  };

  // ── Phase 1: ETH + SOL (fast) ────────────────────────────────────────────
  // Run both in parallel with a strict per-phase timeout. Save what we got.
  let ethereum: ChainResult = ETH_BASE;
  let solana: ChainResult = SOL_BASE;
  const phase1Start = Date.now();

  try {
    const settled = await Promise.allSettled([
      withTimeout(fetchEthereumHolders(), PHASE_1_BUDGET_MS, "ETH").catch(
        (e) => {
          console.error("[holders] ETH error:", e);
          return ETH_BASE;
        }
      ),
      withTimeout(fetchSolanaHolders(), PHASE_1_BUDGET_MS, "SOL").catch((e) => {
        console.error("[holders] SOL error:", e);
        return SOL_BASE;
      }),
    ]);

    if (settled[0].status === "fulfilled") ethereum = settled[0].value;
    if (settled[1].status === "fulfilled") solana = settled[1].value;

    const phase1Duration = Date.now() - phase1Start;
    attempt.ethereum = {
      ok: ethereum.holders !== "N/A",
      reason:
        ethereum.holders === "N/A" ? "all sources failed" : undefined,
      durationMs: phase1Duration,
    };
    attempt.solana = {
      ok: solana.holders !== "N/A",
      reason: solana.holders === "N/A" ? "all RPCs failed" : undefined,
      durationMs: phase1Duration,
    };

    // Save Phase 1 immediately — this is the critical fix.
    // Even if Phase 2 hangs forever, ETH/SOL are now persisted.
    await mergePhaseAndSave([ethereum, solana], "Phase 1 (ETH+SOL)");
  } catch (e) {
    console.error("[holders] Phase 1 catastrophic failure:", e);
  }

  // ── Phase 2: Base (slow) ─────────────────────────────────────────────────
  // Hard wall-clock deadline so we always finish before maxDuration.
  const remaining = refreshDeadline - Date.now() - BASE_DEADLINE_BUFFER_MS;

  if (remaining < 30_000) {
    console.warn(
      `[holders] Skipping Phase 2 — only ${remaining}ms remaining of budget`
    );
    attempt.base = {
      ok: false,
      reason: `insufficient time (${remaining}ms left)`,
      durationMs: 0,
    };
  } else {
    const phase2Start = Date.now();

    try {
      const { result: base, pages, reason } = await withTimeout(
        fetchBaseHolders(),
        remaining + 5_000,
        "BASE"
      ).catch((e) => {
        console.error("[holders] BASE error:", e);
        return { result: BASE_DEFAULT, pages: 0, reason: String(e) };
      });

      attempt.base = {
        ok: base.holders !== "N/A",
        reason,
        durationMs: Date.now() - phase2Start,
        pages,
      };

      await mergePhaseAndSave([base], "Phase 2 (BASE)");
    } catch (e) {
      console.error("[holders] Phase 2 catastrophic failure:", e);
      attempt.base = {
        ok: false,
        reason: String(e),
        durationMs: Date.now() - phase2Start,
      };
    }
  }

  // ── Persist telemetry so the diagnose endpoint shows what happened ──
  try {
    await saveAttemptTelemetry(attempt);
  } catch (e) {
    console.error("[holders] Failed to save attempt telemetry:", e);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `[holders] ═══ Refresh complete in ${elapsed}s ═══\n` +
      `  ETH: ${attempt.ethereum.ok ? "OK" : "FAIL"} (${attempt.ethereum.durationMs}ms)\n` +
      `  SOL: ${attempt.solana.ok ? "OK" : "FAIL"} (${attempt.solana.durationMs}ms)\n` +
      `  BASE: ${attempt.base.ok ? "OK" : "FAIL"} (${attempt.base.durationMs}ms, ${attempt.base.pages ?? 0} pages)${attempt.base.reason ? ` — ${attempt.base.reason}` : ""}`
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
// GET /api/holders                    → instant read from DB
// GET /api/holders?refresh=1          → trigger refresh, return current DB data
// GET /api/holders?refresh=1&wait=1   → trigger refresh and wait (for cron)
// GET /api/holders?diagnose=1         → return DB state + last attempt telemetry
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const wantRefresh = params.get("refresh") === "1" || params.get("force") === "1";
    const waitForRefresh = params.get("wait") === "1";
    const wantDiagnose = params.get("diagnose") === "1";

    // Diagnostic endpoint — exposes telemetry without triggering work
    if (wantDiagnose) {
      const dbData = await loadFromDatabase();
      if (!dbData) {
        return NextResponse.json(
          { error: "No data in database", refreshInProgress: refreshPromise !== null },
          { status: 404 }
        );
      }
      const ageMs = Date.now() - new Date(dbData.lastUpdated).getTime();
      return NextResponse.json({
        lastUpdated: dbData.lastUpdated,
        ageHours: (ageMs / 3600000).toFixed(2),
        isStale: ageMs > STALE_AFTER_MS,
        holders: dbData.holders,
        lastAttempt: dbData.lastAttempt ?? null,
        refreshInProgress: refreshPromise !== null,
      });
    }

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
        // Schedule with `after` — keeps the function alive past the response
        // (up to maxDuration), unlike a bare fire-and-forget which can be
        // killed when the response is sent.
        after(refreshHolders);
      }
    }

    // Serve from database (source of truth on serverless)
    const dbData = await loadFromDatabase();
    if (dbData) {
      // Check staleness — if data is too old, schedule a post-response refresh.
      // `after` ensures the work runs to completion even after the user has
      // their response, unlike a naked fire-and-forget that the runtime can kill.
      if (!wantRefresh && dbData.lastUpdated) {
        const age = Date.now() - new Date(dbData.lastUpdated).getTime();
        if (age > STALE_AFTER_MS) {
          console.log(
            `[holders] Data is ${(age / 3600000).toFixed(1)}h old — scheduling post-response refresh`
          );
          after(refreshHolders);
        }
      }
      // Holder data refreshes a few times a day — let the CDN cache it.
      return NextResponse.json(dbData, {
        headers: {
          "Cache-Control":
            "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      });
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
