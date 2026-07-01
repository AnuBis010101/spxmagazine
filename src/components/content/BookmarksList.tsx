"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
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
        <div className="w-16 h-16 rounded-full bg-mag-dark border border-mag-border flex items-center justify-center mb-6">
          <Bookmark className="w-7 h-7 text-mag-muted" />
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
