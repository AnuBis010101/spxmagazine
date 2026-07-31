import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getPostBySlug } from "@/lib/queries/articles";
import { stripHtml } from "@/lib/utils/strip-html";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/* ── Why this is cached rather than "made fast" ──────────────────────────────
   The upstream Edge TTS endpoint is throttled and wildly variable: measured
   locally, one ~3,000-char chunk took anywhere from 1.9s to 29s, and running
   six in parallel pushed most of them to ~28s each. So a long article cannot
   be synthesised quickly on demand, no matter how the requests are arranged.

   What we can do is synthesise each article's audio exactly once. The MP3 is
   stored in Supabase Storage under a key derived from the article text, so:
     - every listen after the first is a redirect to a CDN file (instant), and
     - editing an article changes the hash, so stale audio is never served.
   Generation is also parallelised, which cuts the one-off first run.
   ──────────────────────────────────────────────────────────────────────── */

const AUDIO_BUCKET = "audio";
/** Concurrent synthesis requests. Above ~4 the upstream throttles hard. */
const CONCURRENCY = 4;
/** Rough seconds per round of chunks — used only for the client's progress estimate. */
const SECONDS_PER_ROUND = 16;

function storageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Content-addressed: audio is keyed by the text it was made from. */
function audioPath(slug: string, text: string) {
  const hash = createHash("sha256").update(text).digest("hex").slice(0, 16);
  return `tts/${slug}-${hash}.mp3`;
}

async function findCached(path: string): Promise<string | null> {
  const supabase = storageClient();
  if (!supabase) return null;
  const slashAt = path.lastIndexOf("/");
  const dir = path.slice(0, slashAt);
  const file = path.slice(slashAt + 1);
  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .list(dir, { search: file, limit: 1 });
  if (error || !data?.length) return null;
  const { data: pub } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(path);
  return pub?.publicUrl ?? null;
}

async function putCached(path: string, body: Buffer): Promise<string | null> {
  const supabase = storageClient();
  if (!supabase) return null;
  const { error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(path, body, { contentType: "audio/mpeg", upsert: true });
  if (error) {
    // A cache miss is survivable — the caller still has the audio to return.
    console.warn(`[TTS] cache upload failed: ${error.message}`);
    return null;
  }
  const { data: pub } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(path);
  return pub?.publicUrl ?? null;
}

// ── Text processing ─────────────────────────────────────────────────────────

/** Sanitize text to remove characters that could break SSML/TTS */
function sanitizeText(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, " - ")
    .replace(/\u2026/g, "...")
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

/** Split text into chunks at sentence boundaries */
function splitText(text: string, maxLen = 3000): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    let splitAt = -1;
    for (const sep of [". ", "! ", "? ", ".\n", "!\n", "?\n"]) {
      const idx = remaining.lastIndexOf(sep, maxLen);
      if (idx > splitAt) splitAt = idx + sep.length;
    }

    if (splitAt <= 0) splitAt = remaining.lastIndexOf(" ", maxLen);
    if (splitAt <= 0) splitAt = maxLen;

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  return chunks.filter((c) => c.length > 0);
}

// ── TTS generation (in-process, no child_process) ───────────────────────────

/** Collect a Readable stream into a Buffer */
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/** Generate audio for a single text chunk. Retries up to 3 times. */
async function generateChunk(
  chunkText: string,
  chunkIndex: number
): Promise<Buffer> {
  // Dynamic import so the bundler includes msedge-tts in the serverless function
  const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");

  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(
        "en-US-JennyNeural",
        OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
      );

      const { audioStream } = tts.toStream(chunkText);
      const buffer = await streamToBuffer(audioStream);

      tts.close();

      if (buffer.length === 0) {
        throw new Error(`Chunk ${chunkIndex}: stream returned 0 bytes`);
      }

      console.log(
        `[TTS] Chunk ${chunkIndex} attempt ${attempt}: ${buffer.length} bytes`
      );

      return buffer;
    } catch (e: unknown) {
      lastError = e instanceof Error ? e : new Error(String(e));
      console.warn(
        `[TTS] Chunk ${chunkIndex} attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`
      );

      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Chunk ${chunkIndex} failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}

/** Generate full audio from plain text. Returns an MP3 buffer. */
async function generateAudio(text: string): Promise<Buffer> {
  const sanitized = sanitizeText(text);

  if (!sanitized || sanitized.length < 2) {
    throw new Error("Text too short after sanitization");
  }

  const chunks = splitText(sanitized);
  console.log(
    `[TTS] Processing ${chunks.length} chunk(s), ${sanitized.length} chars total`
  );

  /* Chunks are independent, so synthesise CONCURRENCY of them at a time
     instead of one after another. Results are written back by index, so the
     MP3 frames still concatenate in reading order regardless of which
     request finishes first. */
  const buffers: Buffer[] = new Array(chunks.length);
  let next = 0;

  async function worker() {
    for (;;) {
      const i = next++;
      if (i >= chunks.length) return;
      buffers[i] = await generateChunk(chunks[i], i + 1);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, worker)
  );

  const final = Buffer.concat(buffers);

  if (final.length === 0) {
    throw new Error("All chunks generated but final buffer is empty");
  }

  return final;
}

// ── Route handler ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const post = await getPostBySlug(slug);
  if (!post || !post.body_html) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const plainText = stripHtml(post.body_html);

  if (!plainText || plainText.trim().length < 10) {
    return NextResponse.json(
      { error: "Article text too short for TTS" },
      { status: 400 }
    );
  }

  // Cap at 50k chars to keep generation time reasonable
  const text =
    plainText.length > 50_000 ? plainText.slice(0, 50_000) : plainText;

  const path = audioPath(slug, text);
  const cachedUrl = await findCached(path);

  /* The player asks first so it knows whether to play immediately or show a
     progress bar, and for how long. Cheap: a storage list, no synthesis. */
  if (req.nextUrl.searchParams.get("probe") === "1") {
    const chunkCount = Math.max(1, Math.ceil(text.length / 3000));
    const rounds = Math.ceil(chunkCount / CONCURRENCY);
    return NextResponse.json(
      {
        cached: !!cachedUrl,
        url: cachedUrl ?? null,
        estimatedSeconds: cachedUrl ? 0 : rounds * SECONDS_PER_ROUND,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // Already synthesised for this exact text — hand off to the CDN copy.
  if (cachedUrl) {
    console.log(`[TTS] cache hit for "${slug}"`);
    return NextResponse.redirect(cachedUrl, {
      status: 302,
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  // Retry the entire pipeline up to 2 times
  const MAX_ATTEMPTS = 2;
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      console.log(
        `[TTS] Attempt ${attempt}/${MAX_ATTEMPTS} for slug="${slug}" (${text.length} chars)`
      );

      const audioBuffer = await generateAudio(text);

      // Quick MP3 sanity check
      const isMP3 =
        (audioBuffer[0] === 0x49 &&
          audioBuffer[1] === 0x44 &&
          audioBuffer[2] === 0x33) || // ID3
        (audioBuffer[0] === 0xff && (audioBuffer[1] & 0xe0) === 0xe0); // MPEG sync

      if (!isMP3) {
        console.warn(
          `[TTS] Warning: may not be valid MP3 (first bytes: 0x${audioBuffer[0]?.toString(16)} 0x${audioBuffer[1]?.toString(16)})`
        );
      }

      console.log(
        `[TTS] Success: ${audioBuffer.length} bytes for "${slug}"`
      );

      // Persist so this article is never synthesised again. Awaited, so a
      // second listener moments later gets the cache rather than a second run.
      await putCached(path, audioBuffer);

      return new NextResponse(new Uint8Array(audioBuffer), {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(audioBuffer.length),
          "Cache-Control": "public, s-maxage=31536000, max-age=86400, immutable",
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      lastError = msg;
      console.error(
        `[TTS] Attempt ${attempt}/${MAX_ATTEMPTS} failed: ${msg}`
      );

      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  return NextResponse.json(
    { error: `TTS generation failed: ${lastError}` },
    { status: 500 }
  );
}
