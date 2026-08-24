"use client";

import { useEffect, useState } from "react";
import AeonMark from "@/components/aeon/AeonMark";
import { AEON_REFERENCE } from "@/lib/aeon";
import Link from "next/link";
import { useBookmarks } from "@/hooks/useBookmarks";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types/content";
import ArticleCard from "@/components/content/ArticleCard";

export default function BookmarksList() {
  const { bookmarkedSlugs } = useBookmarks();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (bookmarkedSlugs.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPosts() {
      setLoading(true);
      setError(false);
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("posts")
          .select("*, category:categories(*)")
          .in("slug", bookmarkedSlugs)
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (cancelled) return;
        if (fetchError) {
          setError(true);
        } else {
          setPosts((data as Post[]) || []);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarked posts:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [bookmarkedSlugs]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-mag-dark border border-mag-border animate-pulse"
          >
            <div className="aspect-video bg-mag-border/50 rounded-t-xl" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-mag-border/50 rounded w-3/4" />
              <div className="h-4 bg-mag-border/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="font-display text-xl font-bold text-white mb-2">
          Couldn&apos;t load your reading list
        </h2>
        <p className="text-mag-muted text-sm max-w-md mb-6">
          Something went wrong fetching your saved articles. Your bookmarks are
          safe — please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 text-mag-black text-sm font-bold hover:bg-gold-400/90 transition-colors"
        >
          Reload
        </button>
      </div>
    );
  }

  if (bookmarkedSlugs.length === 0 || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* An Aeon keeps the shelf rather than a grey icon. Same 64px
            footprint the slot already had — this is the most restrained page
            on the site and an oversized portrait would turn an accent into a
            feature. One fixed frame, so the page looks the same each visit. */}
        <div className="bm-empty-mark mb-6">
          <AeonMark id={AEON_REFERENCE} size={64} opacity={0.7} />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">
          No saved articles yet
        </h2>
        <p className="text-mag-muted text-sm max-w-md mb-6">
          Bookmark articles as you browse and they will appear here for easy
          access later.
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 text-mag-black text-sm font-bold hover:bg-gold-400/90 transition-colors"
        >
          Browse Articles
        </Link>

        <style>{`
          /* A slow breathe, 4px on a 64px element. At 6px it reads as bobbing.
             The blanket prefers-reduced-motion rule in globals.css already
             flattens this, so no local guard is needed. */
          .bm-empty-mark { animation: bmBreathe 7s ease-in-out infinite; }
          @keyframes bmBreathe {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}
