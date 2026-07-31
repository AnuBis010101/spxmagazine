import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/queries/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/* ── Pre-warm article narration ──────────────────────────────────────────────
   Synthesis is cached per article (see ../route.ts), so the cost is paid once
   — but somebody still has to pay it, and for a long article that is ~30s of
   staring at a progress bar. This runs on a cron so that somebody is us,
   before any reader presses play.

   Each run tops up a few of the newest articles and stops; the backlog drains
   over successive runs, which keeps every invocation well inside the function
   timeout and stays gentle on the throttled upstream TTS endpoint.
   ──────────────────────────────────────────────────────────────────────── */

/** Articles to synthesise per invocation. Each can take ~30s. */
const PER_RUN = 3;
/** How far back to look for anything still missing audio. */
const SCAN = 12;

/* Always call our own deployment, never NEXT_PUBLIC_SITE_URL — that points at
   the live site, so a preview or local run would otherwise warm production's
   cache (and hit a build of /api/tts that may not share this one's contract). */
function siteOrigin(req: NextRequest) {
  return req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const origin = siteOrigin(req);

  // Newest articles and news, since those are what readers actually open.
  const [articles, news] = await Promise.all([
    getPublishedPosts("article", 1, SCAN),
    getPublishedPosts("news", 1, SCAN),
  ]);

  const candidates = [...articles.posts, ...news.posts]
    .filter((p) => p.slug && p.body_html)
    .sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));

  const warmed: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const post of candidates) {
    if (warmed.length >= PER_RUN) break;

    try {
      const probe = await fetch(
        `${origin}/api/tts?slug=${encodeURIComponent(post.slug)}&probe=1`,
        { cache: "no-store" }
      ).then((r) => (r.ok ? r.json() : null));

      if (probe?.cached) {
        skipped.push(post.slug);
        continue;
      }

      // Generating is the point; the audio itself is written to storage by
      // the tts route, so the response body is discarded here.
      const res = await fetch(
        `${origin}/api/tts?slug=${encodeURIComponent(post.slug)}`,
        { cache: "no-store", redirect: "follow" }
      );
      if (!res.ok) throw new Error(`status ${res.status}`);
      await res.arrayBuffer();

      warmed.push(post.slug);
    } catch (e) {
      failed.push(`${post.slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return NextResponse.json(
    {
      warmed,
      alreadyCached: skipped.length,
      failed,
      remaining: Math.max(0, candidates.length - skipped.length - warmed.length),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
