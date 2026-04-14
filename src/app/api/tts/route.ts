import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/queries/articles";
import { stripHtml } from "@/lib/utils/strip-html";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Inline TTS script content to ensure it's always available
const TTS_SCRIPT_CONTENT = `// Standalone script to generate TTS audio via Microsoft Edge TTS
// Usage: node tts-generate.mjs <inputTextFile> <outputMp3File>
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { readFileSync, writeFileSync, readFile, rmSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  process.stderr.write("Usage: node tts-generate.mjs <inputTextFile> <outputMp3File>\\n");
  process.exit(1);
}

const text = readFileSync(inputPath, "utf-8").trim();
if (!text) {
  process.stderr.write("Empty input\\n");
  process.exit(1);
}

// Split text into chunks at sentence boundaries
function splitText(text, maxLen = 3000) {
  if (text.length <= maxLen) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    let splitAt = -1;
    for (const sep of [". ", "! ", "? ", ".\\n", "!\\n", "?\\n"]) {
      const idx = remaining.lastIndexOf(sep, maxLen);
      if (idx > splitAt) splitAt = idx + sep.length;
    }

    if (splitAt <= 0) splitAt = remaining.lastIndexOf(" ", maxLen);
    if (splitAt <= 0) splitAt = maxLen;

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  return chunks.filter(c => c.length > 0);
}

// Sanitize text to remove characters that could break SSML/TTS
function sanitizeText(text) {
  return text
    .replace(/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]/g, "")
    .replace(/[\\u2018\\u2019]/g, "'")
    .replace(/[\\u201C\\u201D]/g, '"')
    .replace(/[\\u2013\\u2014]/g, " - ")
    .replace(/\\u2026/g, "...")
    .replace(/[\\u200B\\u200C\\u200D\\uFEFF]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\\n{3,}/g, "\\n\\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

// Read file as buffer, promisified
function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Generate audio for a single chunk using toFile() for reliability
async function generateChunk(chunkText, chunkIndex, maxRetries = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const tmpDir = mkdtempSync(join(tmpdir(), "tts-chunk-"));

    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(
        "en-US-JennyNeural",
        OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
      );

      // Use toFile() which handles stream piping internally
      const { audioFilePath } = await tts.toFile(tmpDir, chunkText);

      const audioBuffer = await readFileAsync(audioFilePath);

      if (audioBuffer.length === 0) {
        throw new Error(\`Chunk \${chunkIndex} file is empty\`);
      }

      process.stderr.write(
        \`Chunk \${chunkIndex} attempt \${attempt}: \${audioBuffer.length} bytes\\n\`
      );

      tts.close();
      return audioBuffer;
    } catch (e) {
      lastError = e;
      process.stderr.write(
        \`Chunk \${chunkIndex} attempt \${attempt}/\${maxRetries} failed: \${e.message}\\n\`
      );

      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    } finally {
      // Clean up temp directory and contents
      try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  }

  throw new Error(
    \`Chunk \${chunkIndex} failed after \${maxRetries} attempts: \${lastError?.message}\`
  );
}

try {
  const sanitized = sanitizeText(text);

  if (!sanitized || sanitized.length < 2) {
    process.stderr.write("Text too short after sanitization\\n");
    process.exit(1);
  }

  const textChunks = splitText(sanitized);
  process.stderr.write(
    \`Processing \${textChunks.length} chunk(s), total \${sanitized.length} chars\\n\`
  );

  const allBuffers = [];

  for (let i = 0; i < textChunks.length; i++) {
    process.stderr.write(
      \`Chunk \${i + 1}/\${textChunks.length} (\${textChunks[i].length} chars)...\\n\`
    );

    const buffer = await generateChunk(textChunks[i], i + 1);
    allBuffers.push(buffer);
  }

  if (allBuffers.length === 0) {
    process.stderr.write("No audio produced\\n");
    process.exit(1);
  }

  const finalBuffer = Buffer.concat(allBuffers);

  if (finalBuffer.length === 0) {
    process.stderr.write("Final buffer is empty\\n");
    process.exit(1);
  }

  writeFileSync(outputPath, finalBuffer);
  process.stderr.write(\`Done: \${finalBuffer.length} bytes written\\n\`);
  process.stdout.write(String(finalBuffer.length));
} catch (e) {
  process.stderr.write(\`Fatal: \${e.message}\\n\`);
  process.exit(1);
}
`;

async function generateAudio(
  text: string,
  outputPath: string
): Promise<{ bytes: number; stderr: string }> {
  const { execFile } = await import("child_process");
  const { writeFile, unlink } = await import("fs/promises");
  const { randomUUID } = await import("crypto");

  // Write text to a temp file
  const textPath = outputPath.replace(".mp3", ".txt");
  await writeFile(textPath, text, "utf-8");

  // Write script to /tmp to guarantee it exists (bulletproof approach)
  const scriptPath = `/tmp/tts-generate-${randomUUID()}.mjs`;
  await writeFile(scriptPath, TTS_SCRIPT_CONTENT, "utf-8");

  try {
    const result = await new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        execFile(
          "node",
          [scriptPath, textPath, outputPath],
          { timeout: 120000, maxBuffer: 10 * 1024 * 1024 },
          (error, stdout, stderr) => {
            if (error) {
              reject(
                new Error(
                  `Script failed: ${stderr || error.message}` +
                    (error.killed ? " (timeout/killed)" : "")
                )
              );
            } else {
              resolve({ stdout: stdout || "", stderr: stderr || "" });
            }
          }
        );
      }
    );

    const bytes = parseInt(result.stdout.trim(), 10) || 0;
    return { bytes, stderr: result.stderr };
  } finally {
    // Cleanup both text and script files
    unlink(textPath).catch(() => {});
    unlink(scriptPath).catch(() => {});
  }
}

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

  // Limit to ~50k chars to avoid very long generation times
  const text =
    plainText.length > 50000 ? plainText.slice(0, 50000) : plainText;

  const { randomUUID } = await import("crypto");
  const { readFile, unlink, stat } = await import("fs/promises");

  // Retry the entire generation up to 3 times at API level (bulletproof)
  const MAX_ATTEMPTS = 3;
  let lastError = "";
  const errors: string[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const outputPath = `/tmp/tts-${randomUUID()}.mp3`;

    try {
      console.log(
        `[TTS] Attempt ${attempt}/${MAX_ATTEMPTS} for slug="${slug}" (${text.length} chars)`
      );

      const { bytes, stderr } = await generateAudio(text, outputPath);

      if (stderr) {
        console.log(`[TTS] Script output: ${stderr}`);
      }

      // Verify file exists and has content
      let fileSize = 0;
      try {
        const fileStat = await stat(outputPath);
        fileSize = fileStat.size;
      } catch (e) {
        // File doesn't exist
        fileSize = 0;
        const msg = e instanceof Error ? e.message : "unknown";
        console.error(`[TTS] File stat failed: ${msg}`);
      }

      if (fileSize === 0 && bytes === 0) {
        lastError = `Attempt ${attempt}: No audio produced (${bytes} bytes from script, ${fileSize} bytes on disk)`;
        errors.push(lastError);
        console.error(`[TTS] ${lastError}`);

        if (attempt < MAX_ATTEMPTS) {
          console.log(`[TTS] Retrying in 2 seconds...`);
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        return NextResponse.json(
          { error: `TTS: All ${MAX_ATTEMPTS} attempts produced no audio` },
          { status: 500 }
        );
      }

      const audioBuffer = await readFile(outputPath);

      if (audioBuffer.length === 0) {
        lastError = `Attempt ${attempt}: Read returned 0 bytes (stat showed ${fileSize} bytes)`;
        errors.push(lastError);
        console.error(`[TTS] ${lastError}`);

        if (attempt < MAX_ATTEMPTS) {
          console.log(`[TTS] Retrying in 2 seconds...`);
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        return NextResponse.json(
          { error: "TTS: Audio file exists but reading failed" },
          { status: 500 }
        );
      }

      // Verify it looks like an MP3 (starts with ID3 tag or MPEG sync)
      const isMP3 =
        (audioBuffer[0] === 0x49 &&
          audioBuffer[1] === 0x44 &&
          audioBuffer[2] === 0x33) || // ID3
        (audioBuffer[0] === 0xff && (audioBuffer[1] & 0xe0) === 0xe0); // MPEG sync

      if (!isMP3) {
        console.warn(
          `[TTS] Warning: Output may not be valid MP3 (first bytes: 0x${audioBuffer[0]?.toString(16)} 0x${audioBuffer[1]?.toString(16)})`
        );
      }

      console.log(`[TTS] ✓ Success: ${audioBuffer.length} bytes for "${slug}"`);

      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(audioBuffer.length),
          "Cache-Control":
            "public, s-maxage=86400, max-age=0, must-revalidate",
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      lastError = `Attempt ${attempt}: ${msg}`;
      errors.push(lastError);
      console.error(`[TTS] ✗ Generation failed: ${msg}`);

      if (attempt < MAX_ATTEMPTS) {
        console.log(`[TTS] Retrying in 2 seconds...`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
    } finally {
      unlink(outputPath).catch(() => {});
    }
  }

  // All attempts exhausted
  const errorSummary = errors.join(" | ");
  console.error(`[TTS] ✗ All ${MAX_ATTEMPTS} attempts failed: ${errorSummary}`);

  return NextResponse.json(
    {
      error: "TTS generation failed: Unable to generate audio after multiple attempts",
      details: lastError,
    },
    { status: 500 }
  );
}
