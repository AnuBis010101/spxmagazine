"use client";

import { useEffect, useState } from "react";

/**
 * Preloader — deliberately impossible to leave on screen.
 *
 * Dismissal is guaranteed by FOUR independent mechanisms, in order of nicety:
 *  1. React (this component) fades it out after a short hold — the happy path.
 *  2. A hard JS cap here (3.5s) in case timers were throttled.
 *  3. An inline failsafe <script> in the root layout that force-hides the
 *     overlay by id — runs at HTML parse time, independent of React hydration
 *     or even the app bundle loading at all.
 *  4. A pure-CSS keyframe (`preloader-bail`) baked into the SSR markup that
 *     fades it out with zero JavaScript.
 *
 * This component only needs to drive the pretty progress bar; if every bit of
 * its own logic failed, #3 and #4 would still clear the screen.
 */
const PRELOADER_ID = "spx-preloader";

export default function Preloader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">(() => {
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem("spx-loaded")) {
        return "done";
      }
    } catch {
      /* sessionStorage blocked — show it; the failsafes still dismiss it */
    }
    return "loading";
  });
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (phase !== "loading") return;

    const reduce =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    const hold = reduce ? 250 : 1300; // minimum on-screen time
    const cap = reduce ? 800 : 3500; // hard JS cap — never sit past this
    const start = Date.now();

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setProgress(100);
      try {
        sessionStorage.setItem("spx-loaded", "1");
      } catch {
        /* ignore */
      }
      setPhase("leaving");
      timers.push(setTimeout(() => setPhase("done"), reduce ? 200 : 550));
    };

    // Wall-clock progress via setInterval (independent of requestAnimationFrame,
    // which is paused in background tabs). Finishes purely on elapsed time, so no
    // asset/font/load signal can ever hold it open.
    const iv = setInterval(() => {
      if (done) return;
      const p = Math.min(100, Math.round(((Date.now() - start) / hold) * 100));
      setProgress(Math.max(8, p));
      if (Date.now() - start >= hold) finish();
    }, 80);

    timers.push(setTimeout(finish, cap)); // hard cap
    // Returning to a backgrounded tab (timers were throttled) → dismiss now.
    const onVis = () => {
      if (document.visibilityState === "visible" && Date.now() - start >= hold) {
        finish();
      }
    };
    // Back/forward-cache restore → page is already loaded.
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) finish();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onShow);

    return () => {
      clearInterval(iv);
      timers.forEach(clearTimeout);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div
      id={PRELOADER_ID}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === "leaving" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#0A0A0A",
        // Pure-CSS last resort: even with zero JS / failed hydration this fades
        // the overlay out and drops pointer-events after 4s.
        ...(phase === "loading"
          ? { animation: "preloader-bail 500ms ease-in 4000ms forwards" }
          : {}),
      }}
    >
      {/* Radial glow behind logo */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Spinning logo */}
      <div className="relative mb-12">
        {/* Outer ring */}
        <div
          className="absolute inset-[-20px] rounded-full border border-gold-400/20"
          style={{ animation: "preloader-spin 3s linear infinite" }}
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
          style={{ animation: "preloader-spin 5s linear infinite reverse" }}
        />

        {/* Logo with pulse */}
        <div
          className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]"
          style={{ animation: "preloader-pulse 2s ease-in-out infinite" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/spxlogo-light.png"
            alt="Loading"
            width={120}
            height={120}
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.3))" }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-[220px] sm:w-[260px] flex flex-col items-center gap-4">
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
              transform: "translate(-50%, -50%)",
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
    </div>
  );
}
