import { NextRequest, NextResponse, after } from "next/server";

// ── Types ────────────────────────────────────────────────────────────────────

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

interface CounterCulturePayload {
  metrics: Metric[];
  lastUpdated: string;
}

// ── Config ───────────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const STALE_AFTER_MS = 31 * 24 * 60 * 60 * 1000; // 31 days

const DB_KEY = "counter_culture";

// ── Curated metrics (update via Supabase or bump STATIC_METRICS) ────────────
//
// All values are sourced from published reports with an `asOf` date.
// Directional arrows (up/down/flat) indicate the multi-year trend.
// "up" means "metric is increasing" — colour is contextual: an up-trending
// loneliness stat is bad, an up-trending AI-fear stat is bad, etc.
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_METRICS: Metric[] = [
  // ══════════════ LONELINESS EPIDEMIC ══════════════
  {
    id: "cigna-loneliness-score",
    category: "loneliness",
    label: "Cigna Loneliness Score (US)",
    value: "58/100",
    context: "Majority of US adults classified as lonely.",
    source: "Cigna Loneliness Index",
    asOf: "2023",
    direction: "up",
  },
  {
    id: "global-loneliness-pct",
    category: "loneliness",
    label: "Feel lonely often or always",
    value: "24%",
    context: "1 in 4 adults globally — every region.",
    source: "Meta-Gallup State of Social Connections",
    asOf: "2023",
    direction: "up",
  },
  {
    id: "no-close-friends",
    category: "loneliness",
    label: "Men with no close friends",
    value: "15%",
    context: "Up from 3% in 1990 — 5× in one generation.",
    source: "Survey Center on American Life",
    asOf: "2021",
    direction: "up",
  },
  {
    id: "loneliness-health-risk",
    category: "loneliness",
    label: "Loneliness mortality risk",
    value: "=15 cigs/day",
    context: "US Surgeon General's advisory: isolation kills.",
    source: "US Surgeon General",
    asOf: "2023",
    direction: "up",
  },
  {
    id: "living-alone-pct",
    category: "loneliness",
    label: "US households of one person",
    value: "29%",
    context: "Up from 13% in 1960 — record high.",
    source: "US Census ACS",
    asOf: "2023",
    direction: "up",
  },

  // ══════════════ DOOMERISM RISING ══════════════
  {
    id: "consumer-sentiment",
    category: "doomerism",
    label: "Michigan Consumer Sentiment",
    value: "Near lows",
    context: "Non-recession readings at multi-decade lows.",
    source: "U. of Michigan / FRED (UMCSENT)",
    asOf: "recent months",
    direction: "down",
  },
  {
    id: "wrong-track",
    category: "doomerism",
    label: "US \"on the wrong track\"",
    value: "~65%",
    context: "Two-thirds of Americans say the country is headed the wrong way.",
    source: "Reuters / Ipsos",
    asOf: "2024",
    direction: "up",
  },
  {
    id: "gen-z-optimism",
    category: "doomerism",
    label: "Gen Z optimistic about future",
    value: "<40%",
    context: "Less than half of young adults see a better tomorrow.",
    source: "Deloitte Gen Z & Millennial Survey",
    asOf: "2024",
    direction: "down",
  },
  {
    id: "doom-searches",
    category: "doomerism",
    label: "Searches for \"recession\" / \"collapse\"",
    value: "Near 10y highs",
    context: "Doomer vocabulary trending at record levels.",
    source: "Google Trends",
    asOf: "ongoing",
    direction: "up",
  },

  // ══════════════ MEANING CRISIS ══════════════
  {
    id: "religious-nones",
    category: "meaning",
    label: "US religious \"nones\"",
    value: "28%",
    context: "Unaffiliated now rivals largest Christian denominations.",
    source: "Pew Research",
    asOf: "2023",
    direction: "up",
  },
  {
    id: "life-has-meaning",
    category: "meaning",
    label: "Life has clear meaning (US)",
    value: "64%",
    context: "Down from 79% in 2007 — steepest drop on record.",
    source: "Pew Research Global Attitudes",
    asOf: "2021",
    direction: "down",
  },
  {
    id: "antinatalism",
    category: "meaning",
    label: "Antinatalism search interest",
    value: "Record high",
    context: "\"Why have kids\" searches at all-time peak.",
    source: "Google Trends",
    asOf: "ongoing",
    direction: "up",
  },

  // ══════════════ AI ANXIETY ══════════════
  {
    id: "ai-concern",
    category: "ai",
    label: "More concerned than excited about AI",
    value: "52%",
    context: "Majority of US adults fear AI outweighs its benefits.",
    source: "Pew Research",
    asOf: "2023",
    direction: "up",
  },
  {
    id: "tech-layoffs",
    category: "ai",
    label: "Tech layoffs since 2023",
    value: "400,000+",
    context: "Many cited AI / restructuring as primary cause.",
    source: "Layoffs.fyi",
    asOf: "2024-2025",
    direction: "up",
  },
  {
    id: "agi-searches",
    category: "ai",
    label: "Searches for \"AGI\" and \"AI doom\"",
    value: "Rising sharply",
    context: "Existential AI concern now mainstream.",
    source: "Google Trends",
    asOf: "ongoing",
    direction: "up",
  },
  {
    id: "ai-replace-job",
    category: "ai",
    label: "Fear AI will replace their job",
    value: "19%",
    context: "Very concerned; 30% somewhat concerned.",
    source: "Pew Research",
    asOf: "2023",
    direction: "up",
  },

  // ══════════════ TRUST COLLAPSE ══════════════
  {
    id: "trust-government",
    category: "trust",
    label: "Trust in US federal government",
    value: "~20%",
    context: "Near historic lows since 1958.",
    source: "Pew Research",
    asOf: "2024",
    direction: "down",
  },
  {
    id: "trust-media",
    category: "trust",
    label: "Trust in mass media (US)",
    value: "32%",
    context: "Record low in Gallup's 50+ year series.",
    source: "Gallup",
    asOf: "2023",
    direction: "down",
  },
  {
    id: "edelman-trust",
    category: "trust",
    label: "Trust in institutions (US)",
    value: "49%",
    context: "Government, media, business, NGOs composite.",
    source: "Edelman Trust Barometer",
    asOf: "2024",
    direction: "down",
  },

  // ══════════════ DEATHS OF DESPAIR ══════════════
  {
    id: "overdose-deaths",
    category: "despair",
    label: "US overdose deaths (annual)",
    value: "~107,500",
    context: "Nearly 300 Americans die from overdose every day.",
    source: "CDC National Center for Health Statistics",
    asOf: "2023",
    direction: "up",
  },
  {
    id: "suicide-rate",
    category: "despair",
    label: "US suicide rate per 100k",
    value: "14.3",
    context: "Near the highest rate since WWII.",
    source: "CDC WONDER",
    asOf: "2022",
    direction: "up",
  },
  {
    id: "alcohol-deaths",
    category: "despair",
    label: "Alcohol-related deaths (US/yr)",
    value: "~178,000",
    context: "Deaths of despair triad: drugs, alcohol, suicide.",
    source: "CDC",
    asOf: "2021-2022",
    direction: "up",
  },

  // ══════════════ SOCIAL FRAGMENTATION ══════════════
  {
    id: "first-marriage-age",
    category: "fragmentation",
    label: "Median age of first marriage (US)",
    value: "30 / 28",
    context: "Men / women — record highs, still climbing.",
    source: "US Census",
    asOf: "2023",
    direction: "up",
  },
  {
    id: "marriage-rate",
    category: "fragmentation",
    label: "US marriage rate per 1,000",
    value: "6.2",
    context: "Lowest on record.",
    source: "CDC National Center for Health Statistics",
    asOf: "2022",
    direction: "down",
  },
  {
    id: "birth-rate",
    category: "fragmentation",
    label: "US fertility rate",
    value: "1.62",
    context: "Below 2.1 replacement — demographic decline.",
    source: "CDC National Vital Statistics",
    asOf: "2023",
    direction: "down",
  },
  {
    id: "no-partner",
    category: "fragmentation",
    label: "US adults with no romantic partner",
    value: "30%",
    context: "Including 63% of men under 30 who are single.",
    source: "Pew Research",
    asOf: "2022",
    direction: "up",
  },
];

// ── Database persistence ─────────────────────────────────────────────────────

async function loadFromDatabase(): Promise<CounterCulturePayload | null> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", DB_KEY)
      .single();

    if (error || !data?.value) return null;
    return data.value as CounterCulturePayload;
  } catch (e) {
    console.error("[counter-culture] DB load failed:", e);
    return null;
  }
}

async function saveToDatabase(payload: CounterCulturePayload): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase
      .from("site_settings")
      .upsert(
        { key: DB_KEY, value: payload, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    console.log("[counter-culture] Saved to database");
  } catch (e) {
    console.error("[counter-culture] DB save failed:", e);
  }
}

// ── Refresh logic ────────────────────────────────────────────────────────────
//
// Monthly cron reseeds DB from STATIC_METRICS (curated in code).
// Admins can edit individual values directly in Supabase between cron runs.
// The merge logic prefers existing DB values for metrics that already exist
// (so manual edits aren't overwritten), and fills in any new ones from code.
// ─────────────────────────────────────────────────────────────────────────────

let refreshPromise: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
  const start = Date.now();
  console.log("[counter-culture] ═══ Refresh started ═══");

  const previous = await loadFromDatabase();
  const previousById = new Map<string, Metric>(
    (previous?.metrics ?? []).map((m) => [m.id, m])
  );

  // Merge: keep DB edits, add new metrics, remove any deleted ones
  const merged: Metric[] = STATIC_METRICS.map((base) => {
    const existing = previousById.get(base.id);
    // If an admin edited it in DB, keep their edit — but always refresh `source`
    // and structural fields from code (so rename in code propagates).
    if (existing) {
      return {
        ...base,
        value: existing.value,
        context: existing.context,
        asOf: existing.asOf,
        direction: existing.direction,
      };
    }
    return base;
  });

  const payload: CounterCulturePayload = {
    metrics: merged,
    lastUpdated: new Date().toISOString(),
  };

  await saveToDatabase(payload);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `[counter-culture] ═══ Refresh complete in ${elapsed}s — ${merged.length} metrics ═══`
  );
}

function refreshCounterCulture(): Promise<void> {
  if (refreshPromise) {
    console.log("[counter-culture] Refresh already in progress — reusing promise");
    return refreshPromise;
  }
  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const wantRefresh = params.get("refresh") === "1" || params.get("force") === "1";
    const waitForRefresh = params.get("wait") === "1";

    if (wantRefresh) {
      if (waitForRefresh) {
        await refreshCounterCulture();
        const fresh = await loadFromDatabase();
        if (fresh) return NextResponse.json(fresh);
      } else {
        after(refreshCounterCulture);
      }
    }

    const dbData = await loadFromDatabase();
    if (dbData) {
      if (!wantRefresh && dbData.lastUpdated) {
        const age = Date.now() - new Date(dbData.lastUpdated).getTime();
        if (age > STALE_AFTER_MS) {
          console.log(
            `[counter-culture] Data is ${(age / (24 * 3600000)).toFixed(1)}d old — scheduling post-response refresh`
          );
          after(refreshCounterCulture);
        }
      }
      return NextResponse.json(dbData);
    }

    // First-ever deploy — seed synchronously
    console.log("[counter-culture] No DB data yet — seeding");
    await refreshCounterCulture();
    const fresh = await loadFromDatabase();
    if (fresh) return NextResponse.json(fresh);

    return NextResponse.json(
      { error: "Counter-culture data not yet available, please retry shortly" },
      { status: 503 }
    );
  } catch (error) {
    console.error("[counter-culture] Fatal error:", error);
    return NextResponse.json(
      { error: "Failed to fetch counter-culture data" },
      { status: 500 }
    );
  }
}
