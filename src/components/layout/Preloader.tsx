"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CRITICAL_ASSETS = [
  "/spxlogo.png",
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "finishing" | "done">(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("spx-loaded")) return "done";
    return "loading";
  });
  const rafRef = useRef<number>(0);

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // Skip entirely if we've already loaded this session.
    if (typeof window !== "undefined" && sessionStorage.getItem("spx-loaded")) {
      return;
    }

    let cancelled = false;
    let current = 0;
    let target = 12; // never sit at a dead 0%
    const start = Date.now();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const minTime = reduce ? 200 : 1400; // minimum on-screen time
    const maxTime = 5000; // absolute failsafe — never hang

    const bump = (t: number) => {
      target = Math.max(target, t);
    };

    // Load signals nudge the target upward — but they can NEVER block completion.
    Promise.all(CRITICAL_ASSETS.map((src) => preloadImage(src))).then(() => bump(80));
    if (document.fonts?.ready) document.fonts.ready.then(() => bump(92));
    else bump(92);

    const onLoad = () => bump(100);
    if (document.readyState === "complete") bump(100);
    else window.addEventListener("load", onLoad, { once: true });
    const reachTimer = window.setTimeout(() => bump(100), reduce ? 100 : 1600);

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      setProgress(100);
      setPhase("finishing");
      try {
        sessionStorage.setItem("spx-loaded", "1");
      } catch {
        /* sessionStorage may be unavailable */
      }
      window.setTimeout(() => setPhase("done"), reduce ? 200 : 700);
    };

    // Hard failsafe: dismiss no matter what (covers throttled rAF / missing events).
    const failsafe = window.setTimeout(finish, maxTime);

    const animate = () => {
      if (cancelled) return;
      const elapsed = Date.now() - start;
      current += (target - current) * 0.1;
      // Guaranteed wall-clock progress so the bar always fills to 100% by
      // minTime, even if no asset/font/load signal ever arrives.
      current = Math.max(current, Math.min(100, (elapsed / minTime) * 100));

      setProgress(Math.min(Math.round(current), 100));

      if (current >= 99.5 && elapsed >= minTime) {
        finish();
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(failsafe);
      window.clearTimeout(reachTimer);
      window.removeEventListener("load", onLoad);
    };
  }, [preloadImage]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === "finishing" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Radial glow behind logo */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Spinning logo */}
      <div className="relative mb-12">
        {/* Outer ring */}
        <div
          className="absolute inset-[-20px] rounded-full border border-gold-400/20"
          style={{
            animation: "preloader-spin 3s linear infinite",
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold-400"
            style={{
              boxShadow: "0 0 12px rgba(212,175,55,0.8), 0 0 30px rgba(212,175,55,0.3)",
            }}
          />
        </div>

        {/* Inner ring */}
        <div
          className="absolute inset-[-8px] rounded-full border border-gold-400/10"
          style={{
            animation: "preloader-spin 5s linear infinite reverse",
          }}
        />

        {/* Logo with pulse */}
        <div
          className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]"
          style={{
            animation: "preloader-pulse 2s ease-in-out infinite",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/spxlogo.png"
            alt="Loading"
            width={120}
            height={120}
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(0 0 20px rgba(212,175,55,0.3))",
            }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-[220px] sm:w-[260px] flex flex-col items-center gap-4">
        {/* Bar track */}
        <div
          className="relative w-full h-[3px] rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(212,175,55,0.1)" }}
        >
          {/* Fluid gold fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #8C6F22, #D4AF37, #E1C872, #D4AF37)",
              backgroundSize: "200% 100%",
              animation: "preloader-shimmer 1.5s ease-in-out infinite",
              boxShadow: "0 0 12px rgba(212,175,55,0.5), 0 0 4px rgba(212,175,55,0.8)",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Glow at tip */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none"
            style={{
              left: `${progress}%`,
              transform: `translate(-50%, -50%)`,
              background: "radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)",
              opacity: progress > 0 && progress < 100 ? 1 : 0,
              transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
            }}
          />
        </div>

        {/* Percentage */}
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            color: "rgba(212,175,55,0.5)",
          }}
        >
          {progress}%
        </span>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes preloader-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes preloader-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes preloader-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
