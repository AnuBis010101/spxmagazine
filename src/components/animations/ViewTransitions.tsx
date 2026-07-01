"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Native View Transitions for client navigation, feature-detected.
 *
 * A capture-phase click listener intercepts same-origin internal link clicks
 * and runs the navigation inside document.startViewTransition, so the browser
 * cross-fades the outgoing/incoming pages (gold wipe, see globals.css) and
 * morphs any shared element tagged view-transition-name: spx-cover — the
 * clicked card cover into the article's hero cover.
 *
 * When the API is unavailable (or the user prefers reduced motion) this does
 * nothing and PageTransition's Framer fade remains the fallback.
 *
 * The startViewTransition callback must resolve once the new route has
 * committed; we resolve it when usePathname changes (with a safety timeout so
 * a slow/aborted navigation can never freeze the UI on a stale snapshot).
 */
export default function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pendingResolve = useRef<(() => void) | null>(null);

  // Resolve the in-flight transition once the route commits.
  useEffect(() => {
    if (pendingResolve.current) {
      pendingResolve.current();
      pendingResolve.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined" || !("startViewTransition" in document)) {
      return;
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return; // internal absolute paths only
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel")?.includes("external")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith("/api/")) return; // not a page
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return; // same page (e.g. hash) — let the browser handle it
      }

      // We own this navigation now.
      e.preventDefault();
      e.stopPropagation();

      // Tag the clicked card's cover so it morphs into the detail hero cover.
      // First clear any other cover holding the shared name (e.g. the current
      // detail hero, when clicking a related-article card) so it stays unique —
      // duplicate view-transition-names abort the morph.
      document
        .querySelectorAll<HTMLElement>("[data-vt-cover]")
        .forEach((el) => {
          el.style.viewTransitionName = "";
        });
      const cover = anchor.querySelector<HTMLElement>("[data-vt-cover]");
      if (cover) cover.style.viewTransitionName = "spx-cover";
      const clearCover = () => {
        if (cover) cover.style.viewTransitionName = "";
      };

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            let settled = false;
            const finish = () => {
              if (settled) return;
              settled = true;
              resolve();
            };
            pendingResolve.current = finish;
            router.push(url.pathname + url.search + url.hash);
            // Safety net: never let a slow/aborted nav freeze on a stale snapshot.
            window.setTimeout(finish, 600);
          })
      );

      transition.finished.finally(clearCover);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
