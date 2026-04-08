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
  const startTime = useRef(Date.now());

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    let target = 0;
    let current = 0;

    // Phase 1: Preload critical assets (0-70%)
    const assetPromises = CRITICAL_ASSETS.map((src) => preloadImage(src));

    let assetsLoaded = 0;
    assetPromises.forEach((p) =>
      p.then(() => {
        assetsLoaded++;
        target = Math.max(target, (assetsLoaded / CRITICAL_ASSETS.length) * 70);
      })
    );

    // Phase 2: Wait for fonts (70-85%)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        target = Math.max(target, 85);
      });
    } else {
      target = Math.max(target, 85);
    }

    // Phase 3: DOM ready (85-100%)
    const onReady = () => {
      target = 100;
    };

    if (document.readyState === "complete") {
      Promise.all(assetPromises).then(onReady);
    } else {
      window.addEventListener("load", onReady, { once: true });
      // Fallback: if load event already fired or takes too long
      Promise.all(assetPromises).then(() => {
        setTimeout(onReady, 300);
      });
    }

    // Minimum display time for premium feel
    const minTime = 1400;

    // Smooth progress animation
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      // Ease toward target
      current += (target - current) * 0.08;

      // Slow organic growth when waiting
      if (target < 70 && current < 40) {
        current = Math.max(current, (elapsed / minTime) * 35);
      }

      const rounded = Math.min(Math.round(current), 100);
      setProgress(rounded);

      if (rounded >= 100 && elapsed >= minTime) {
        setPhase("finishing");
        sessionStorage.setItem("spx-loaded", "1");
        setTimeout(() => setPhase("done"), 800);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("load", onReady);
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
