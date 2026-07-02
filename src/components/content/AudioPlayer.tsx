"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Headphones,
  Play,
  Pause,
  Square,
  Loader2,
  RotateCcw,
} from "lucide-react";

interface AudioPlayerProps {
  slug: string;
  title: string;
  estimatedMinutes?: number;
}

const SPEEDS = [1, 1.25, 1.5, 2] as const;
const FETCH_TIMEOUT_MS = 150_000; // 2.5 minutes max for TTS generation

export default function AudioPlayer({
  slug,
  title,
  estimatedMinutes,
}: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [loadingHint, setLoadingHint] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const speed = SPEEDS[speedIndex];
  const reduce = useReducedMotion();

  // Initialize audio element (lazy, reusable)
  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setAudioReady(true);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(100);
    });

    audio.addEventListener("error", () => {
      if (blobUrlRef.current) {
        setError("Playback error — tap play to retry");
        setIsLoading(false);
        setIsPlaying(false);
        // Clean up bad audio so retry fetches fresh
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    });

    return audio;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Abort any in-flight fetch
      abortRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handlePlay = useCallback(async () => {
    const audio = getAudio();

    // If audio is loaded and paused, just resume
    if (blobUrlRef.current && audio.paused && audio.src) {
      audio.play();
      setIsPlaying(true);
      return;
    }

    // Fetch new audio
    setIsLoading(true);
    setError(null);
    setLoadingHint("Generating audio...");

    // Abort any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Show progressive loading hints
    const hintTimer = setTimeout(() => {
      if (mountedRef.current) setLoadingHint("Still generating, almost there...");
    }, 15_000);

    try {
      const res = await fetch(
        `/api/tts?slug=${encodeURIComponent(slug)}`,
        {
          cache: "no-cache",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(FETCH_TIMEOUT_MS),
          ]),
        }
      );

      if (!mountedRef.current) return;

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Server error ${res.status}`);
      }

      const blob = await res.blob();
      if (!mountedRef.current) return;

      if (blob.size === 0) {
        throw new Error("Empty audio response");
      }

      // Clean up old blob if retrying
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }

      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      audio.src = url;
      audio.playbackRate = speed;
      audio.load();

      // Wait for audio to be decodable
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          audio.removeEventListener("canplay", onCanPlay);
          audio.removeEventListener("error", onError);
          resolve();
        };
        const onError = () => {
          audio.removeEventListener("canplay", onCanPlay);
          audio.removeEventListener("error", onError);
          reject(new Error("Audio decode failed"));
        };
        audio.addEventListener("canplay", onCanPlay);
        audio.addEventListener("error", onError);
      });

      if (!mountedRef.current) return;

      setIsLoading(false);
      setLoadingHint("");
      audio.play();
      setIsPlaying(true);
    } catch (e: unknown) {
      if (!mountedRef.current) return;

      const msg = e instanceof Error ? e.message : "Failed to load audio";
      const isAbort =
        e instanceof DOMException && e.name === "AbortError";
      const isTimeout =
        e instanceof DOMException && e.name === "TimeoutError";

      setIsLoading(false);
      setLoadingHint("");

      if (isAbort) {
        // User navigated away or new request started — don't show error
        return;
      }

      setError(
        isTimeout
          ? "Generation timed out — tap play to retry"
          : msg
      );

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    } finally {
      clearTimeout(hintTimer);
    }
  }, [getAudio, slug, speed]);

  const handlePause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const handleSpeedChange = useCallback(() => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[nextIndex];
    }
  }, [speedIndex]);

  const seekTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const clamped = Math.max(0, Math.min(audio.duration, seconds));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
    setProgress((clamped / audio.duration) * 100);
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !audio.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seekTo(pct * audio.duration);
    },
    [seekTo]
  );

  const handleSeekKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !audio.duration) return;
      const STEP = 5; // seconds
      let handled = true;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          seekTo(audio.currentTime + STEP);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          seekTo(audio.currentTime - STEP);
          break;
        case "Home":
          seekTo(0);
          break;
        case "End":
          seekTo(audio.duration);
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    },
    [seekTo]
  );

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const showRetry = !!error && !isLoading;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="bg-black/40 backdrop-blur-md border border-mag-border/50 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Icon + label */}
          <div className="flex items-center gap-2 shrink-0">
            <Headphones className="w-4 h-4 text-gold-400" />
            <span className="text-xs sm:text-sm text-mag-muted hidden sm:inline">
              {isLoading
                ? loadingHint || "Generating..."
                : isPlaying
                  ? "Playing"
                  : showRetry
                    ? "Retry"
                    : "Listen"}
            </span>
          </div>

          {/* Play/Pause/Retry button */}
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={isLoading}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gold-400/60 flex items-center justify-center hover:bg-gold-400/10 transition-colors shrink-0 disabled:opacity-50"
            aria-label={
              isLoading
                ? "Generating audio"
                : isPlaying
                  ? "Pause"
                  : showRetry
                    ? "Retry"
                    : "Play"
            }
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-gold-400 animate-spin" />
            ) : showRetry ? (
              <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
            ) : isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-gold-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-gold-400 ml-0.5" />
            )}
          </button>

          {/* Stop button (only when active) */}
          {(isPlaying || (progress > 0 && !showRetry)) && (
            <button
              onClick={handleStop}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-mag-border/50 flex items-center justify-center hover:bg-mag-border/20 transition-colors shrink-0"
              aria-label="Stop"
            >
              <Square className="w-3 h-3 text-mag-muted" />
            </button>
          )}

          {/* Progress bar — transform-only fill + hover thumb, keyboard-seekable */}
          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek audio position"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            onClick={handleSeek}
            onKeyDown={handleSeekKey}
            className="group/seek relative flex-1 h-1.5 bg-mag-border/30 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left bg-gold-400 rounded-full"
              style={{ transformOrigin: "left center" }}
              initial={false}
              animate={{ scaleX: progress / 100 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            />
            <span
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.6)] opacity-0 transition-opacity duration-200 group-hover/seek:opacity-100 group-focus-visible/seek:opacity-100"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Time display */}
          <span className="text-xs text-mag-muted shrink-0 tabular-nums">
            {audioReady
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : estimatedMinutes
                ? `~${estimatedMinutes}m`
                : ""}
          </span>

          {/* Speed toggle */}
          <button
            onClick={handleSpeedChange}
            className="text-xs font-medium text-gold-400 border border-mag-border/50 rounded-full px-2.5 py-1 hover:bg-gold-400/10 transition-colors shrink-0 tabular-nums"
            aria-label={`Speed: ${speed}x`}
          >
            {speed}x
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
