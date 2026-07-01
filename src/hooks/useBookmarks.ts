"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "spx_bookmarks";
const EVENT_NAME = "spx_bookmarks_change";

/* ------------------------------------------------------------------ */
/*  Tiny external store so every component using the hook stays in sync */
/* ------------------------------------------------------------------ */

const EMPTY_SNAPSHOT: string[] = [];
let listeners: Array<() => void> = [];
let snapshot: string[] = EMPTY_SNAPSHOT;

function emitChange() {
  const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  snapshot = raw ? (JSON.parse(raw) as string[]) : [];
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useBookmarks() {
  // Hydration-safe: SSR returns [], client reads localStorage on mount
  const bookmarkedSlugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Seed snapshot from localStorage once on mount
  useEffect(() => {
    emitChange();

    // Listen for changes from other tabs
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) emitChange();
    }

    // Listen for same-tab custom events
    function onCustom() {
      emitChange();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(EVENT_NAME, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVENT_NAME, onCustom);
    };
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarkedSlugs.includes(slug),
    [bookmarkedSlugs],
  );

  const toggleBookmark = useCallback((slug: string) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    const set = new Set(current);

    if (set.has(slug)) {
      set.delete(slug);
    } else {
      set.add(slug);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));

    // Notify same-tab listeners
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return { bookmarkedSlugs, isBookmarked, toggleBookmark };
}
