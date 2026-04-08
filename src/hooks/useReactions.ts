"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "spx_reactions";

type ReactionType = "fire" | "mindblown" | "clap" | "rocket";
type ReactionsMap = Record<string, ReactionType>;

function readReactions(): ReactionsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReactionsMap) : {};
  } catch {
    return {};
  }
}

export function useReactions(slug: string) {
  const [userReaction, setUserReaction] = useState<string | null>(null);

  // Hydration-safe: read from localStorage only after mount
  useEffect(() => {
    const map = readReactions();
    setUserReaction(map[slug] ?? null);
  }, [slug]);

  const react = useCallback(
    (type: string) => {
      const map = readReactions();

      // Toggle off if same reaction
      if (map[slug] === type) {
        delete map[slug];
        setUserReaction(null);
      } else {
        map[slug] = type as ReactionType;
        setUserReaction(type);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));

      // Fire-and-forget POST to server
      fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, reaction: type }),
      }).catch(() => {
        // Silently fail — the local state is still correct
      });
    },
    [slug],
  );

  return { userReaction, react };
}
