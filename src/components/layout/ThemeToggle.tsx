"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────────────────
   Animated theme toggler.

   The whole page is snapshotted with the View Transitions API and the
   incoming theme is revealed through a clip-path circle that grows from the
   button itself out to the furthest corner of the viewport — so the new
   theme looks like it is being poured from wherever you clicked.

   Everything degrades: without the API, or under prefers-reduced-motion, the
   theme still swaps instantly and only the icon animates. The reveal is
   decoration, never the mechanism.
   ──────────────────────────────────────────────────────────────────────── */

type Theme = "dark" | "gold";

const STORAGE_KEY = "spx-theme";
const REVEAL_MS = 620;
/* Long, slow-settling ease — the expensive-feeling one, not a linear wipe. */
const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* The `data-theme` attribute on <html> is the single source of truth — the
   pre-paint script in layout.tsx sets it before React exists, so mirroring it
   into component state would just be a second copy that can disagree.
   Subscribing to the attribute instead keeps every mounted toggle (header and
   mobile menu) in step automatically, and useSyncExternalStore gives the
   correct server snapshot so hydration never mismatches. */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "gold"
    ? "gold"
    : "dark";
}

/* Server render can't know the visitor's saved choice; the store corrects
   itself on hydration and the pre-paint script means the *page* is already
   right either way. */
const readServerTheme = (): Theme => "dark";

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, readServerTheme);
  const btnRef = useRef<HTMLButtonElement>(null);

  const apply = useCallback((next: Theme) => {
    // Setting the attribute is what re-renders the button, via the observer.
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the theme still applies for this session */
    }
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "gold" : "dark";
    const root = document.documentElement;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof document.startViewTransition !== "function") {
      apply(next);
      return;
    }

    // Grow from the button's centre out to the furthest corner, so the circle
    // always covers the viewport no matter which corner the button sits in.
    const r = btnRef.current?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const cy = r ? r.top + r.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    // Marks this transition as a theme swap so the global page-navigation
    // crossfade (globals.css) stands down and leaves the circle clean.
    root.setAttribute("data-theme-vt", "");

    const transition = document.startViewTransition(() => {
      apply(next);
    });

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${radius}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: REVEAL_MS,
            easing: REVEAL_EASE,
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        /* Transition was skipped/aborted — apply() already ran, so the theme
           is correct and only the flourish is lost. */
      });

    transition.finished.finally(() => root.removeAttribute("data-theme-vt"));
  }, [theme, apply]);

  const goingGold = theme === "dark";

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      className={cn("spx-theme-toggle", className)}
      aria-label={goingGold ? "Switch to gold theme" : "Switch to dark theme"}
      title={goingGold ? "Switch to gold theme" : "Switch to dark theme"}
    >
      <span aria-hidden className="spx-theme-toggle-halo" />
      <span aria-hidden className="spx-theme-toggle-icon">
        <SunIcon
          className={cn("spx-theme-toggle-glyph", goingGold ? "is-in" : "is-out")}
        />
        <MoonIcon
          className={cn("spx-theme-toggle-glyph", goingGold ? "is-out" : "is-in")}
        />
      </span>
    </button>
  );
}
