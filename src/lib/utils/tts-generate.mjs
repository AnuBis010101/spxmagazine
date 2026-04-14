// Standalone script to generate TTS audio via Microsoft Edge TTS
// Usage: node tts-generate.mjs <inputTextFile> <outputMp3File>
// Uses toFile() for reliable output, handles long text by splitting into chunks
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { readFileSync, writeFileSync, readFile, rmSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  process.stderr.write("Usage: node tts-generate.mjs <inputTextFile> <outputMp3File>\n");
  process.exit(1);
}

const text = readFileSync(inputPath, "utf-8").trim();
if (!text) {
  process.stderr.write("Empty input\n");
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
    for (const sep of [". ", "! ", "? ", ".\n", "!\n", "?\n"]) {
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
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, " - ")
    .replace(/\u2026/g, "...")
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    // Escape XML special characters that could break SSML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n{3,}/g, "\n\n")
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
        throw new Error(`Chunk ${chunkIndex} file is empty`);
      }

      process.stderr.write(
        `Chunk ${chunkIndex} attempt ${attempt}: ${audioBuffer.length} bytes\n`
      );

      tts.close();
      return audioBuffer;
    } catch (e) {
      lastError = e;
      process.stderr.write(
        `Chunk ${chunkIndex} attempt ${attempt}/${maxRetries} failed: ${e.message}\n`
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
    `Chunk ${chunkIndex} failed after ${maxRetries} attempts: ${lastError?.message}`
  );
}

try {
  const sanitized = sanitizeText(text);

  if (!sanitized || sanitized.length < 2) {
    process.stderr.write("Text too short after sanitization\n");
    process.exit(1);
  }

  const textChunks = splitText(sanitized);
  process.stderr.write(
    `Processing ${textChunks.length} chunk(s), total ${sanitized.length} chars\n`
  );

  const allBuffers = [];

  for (let i = 0; i < textChunks.length; i++) {
    process.stderr.write(
      `Chunk ${i + 1}/${textChunks.length} (${textChunks[i].length} chars)...\n`
    );

    const buffer = await generateChunk(textChunks[i], i + 1);
    allBuffers.push(buffer);
  }

  if (allBuffers.length === 0) {
    process.stderr.write("No audio produced\n");
    process.exit(1);
  }

  const finalBuffer = Buffer.concat(allBuffers);

  if (finalBuffer.length === 0) {
    process.stderr.write("Final buffer is empty\n");
    process.exit(1);
  }

  writeFileSync(outputPath, finalBuffer);
  process.stderr.write(`Done: ${finalBuffer.length} bytes written\n`);
  process.stdout.write(String(finalBuffer.length));
} catch (e) {
  process.stderr.write(`Fatal: ${e.message}\n`);
  process.exit(1);
}
