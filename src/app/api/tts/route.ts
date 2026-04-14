import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/queries/articles";
import { stripHtml } from "@/lib/utils/strip-html";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function generateAudio(
  text: string,
  outputPath: string
): Promise<{ bytes: number; stderr: string }> {
  const { execFile } = await import("child_process");
  const { writeFile, unlink } = await import("fs/promises");

  // Write text to a temp file
  const textPath = outputPath.replace(".mp3", ".txt");
  await writeFile(textPath, text, "utf-8");

  // Build path at runtime to avoid bundler resolution
  const scriptPath = [
    process.cwd(),
    "src",
    "lib",
    "utils",
    "tts-generate.mjs",
  ].join("/");

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
    unlink(textPath).catch(() => {});
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

  // Retry the entire generation up to 2 times at API level
  const MAX_ATTEMPTS = 2;
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const outputPath = `/tmp/tts-${randomUUID()}.mp3`;

    try {
      console.log(
        `TTS attempt ${attempt}/${MAX_ATTEMPTS} for "${slug}" (${text.length} chars)`
      );

      const { bytes, stderr } = await generateAudio(text, outputPath);

      if (stderr) {
        console.log(`TTS stderr: ${stderr}`);
      }

      // Verify file exists and has content
      let fileSize = 0;
      try {
        const fileStat = await stat(outputPath);
        fileSize = fileStat.size;
      } catch {
        // File doesn't exist
        fileSize = 0;
      }

      if (fileSize === 0 && bytes === 0) {
        lastError = `Attempt ${attempt}: TTS produced no audio (script reported ${bytes} bytes, file size ${fileSize})`;
        console.error(lastError);

        if (attempt < MAX_ATTEMPTS) {
          // Wait before retry
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        return NextResponse.json(
          {
            error: "TTS generation produced no audio after retries",
          },
          { status: 500 }
        );
      }

      const audioBuffer = await readFile(outputPath);

      if (audioBuffer.length === 0) {
        lastError = `Attempt ${attempt}: File read returned 0 bytes despite stat showing ${fileSize}`;
        console.error(lastError);

        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        return NextResponse.json(
          { error: "TTS produced empty audio file" },
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
          `TTS output may not be valid MP3 (first bytes: ${audioBuffer[0]?.toString(16)} ${audioBuffer[1]?.toString(16)})`
        );
      }

      console.log(`TTS success: ${audioBuffer.length} bytes for "${slug}"`);

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
      console.error(`TTS generation failed (attempt ${attempt}):`, msg);

      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
    } finally {
      unlink(outputPath).catch(() => {});
    }
  }

  return NextResponse.json(
    { error: `TTS generation failed: ${lastError}` },
    { status: 500 }
  );
}
