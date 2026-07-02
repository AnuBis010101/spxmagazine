"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Post, GlossaryTerm } from "@/types/content";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { EASE } from "@/lib/motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResults {
  posts: Post[];
  glossary: GlossaryTerm[];
}

const contentTypePathMap: Record<string, string> = {
  news: "/news/",
  article: "/articles/",
  learn: "/learn/",
};

function CategoryBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex rounded bg-gold-400/15 px-2 py-0.5 text-xs font-medium text-gold-400">
      {type === "article" ? "Articles" : type === "news" ? "News" : type === "learn" ? "Guides" : type}
    </span>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();
  useFocusTrap(isOpen, panelRef);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data: SearchResults = await res.json();
        setResults(data);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, handleSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  const hasResults =
    results && (results.posts.length > 0 || results.glossary.length > 0);
  const noResults = results && !hasResults && query.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative mx-auto flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-mag-border bg-mag-dark shadow-2xl"
            style={{ marginTop: "10vh" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Input */}
            <div className="group relative flex items-center border-b border-mag-border px-4 transition-colors focus-within:border-gold-400/60">
              {/* Focus-glow seam: a soft gold underline that brightens on focus */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 shadow-[0_0_12px_rgba(212,175,55,0.5)] transition-opacity duration-300 group-focus-within:opacity-70"
              />
              <svg
                className="h-5 w-5 shrink-0 text-mag-muted"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, news, learn..."
                className="w-full bg-transparent px-3 py-4 text-lg text-white placeholder:text-mag-muted focus:outline-none"
              />
              <button
                onClick={onClose}
                className="shrink-0 rounded bg-mag-border px-2 py-1 text-xs text-mag-muted transition-colors hover:text-white"
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Empty state */}
              {!query.trim() && (
                <p className="py-8 text-center text-mag-muted">
                  Start typing to search...
                </p>
              )}

              {/* Loading */}
              {isLoading && query.trim() && (
                <p className="py-8 text-center text-mag-muted">Searching...</p>
              )}

              {/* No results */}
              {noResults && !isLoading && (
                <p className="py-8 text-center text-mag-muted">
                  No results found for &ldquo;{query}&rdquo;
                </p>
              )}

              {/* Results */}
              {hasResults && !isLoading && (
                <div className="space-y-6">
                  {/* Posts */}
                  {results.posts.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-gold-400">
                        Articles & News
                      </h3>
                      <ul className="space-y-2">
                        {results.posts.map((post, i) => (
                          <motion.li
                            key={post.id}
                            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: EASE.out, delay: i * 0.03 }}
                          >
                            <Link
                              href={`${contentTypePathMap[post.content_type] || "/articles/"}${post.slug}`}
                              onClick={onClose}
                              className="block rounded-lg p-3 transition-colors hover:bg-white/5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="font-display font-medium text-white">
                                    {post.title}
                                  </p>
                                  {post.excerpt && (
                                    <p className="mt-1 line-clamp-1 text-sm text-mag-muted">
                                      {post.excerpt}
                                    </p>
                                  )}
                                </div>
                                <CategoryBadge type={post.content_type} />
                              </div>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Glossary */}
                  {results.glossary.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-gold-400">
                        Glossary
                      </h3>
                      <ul className="space-y-2">
                        {results.glossary.map((term, i) => (
                          <motion.li
                            key={term.id}
                            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: EASE.out,
                              delay: (results.posts.length + i) * 0.03,
                            }}
                          >
                            <Link
                              href={`/learn/glossary#${term.slug}`}
                              onClick={onClose}
                              className="block rounded-lg p-3 transition-colors hover:bg-white/5"
                            >
                              <p className="font-display font-medium text-white">
                                {term.term}
                              </p>
                              <p className="mt-1 line-clamp-1 text-sm text-mag-muted">
                                {term.definition}
                              </p>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer: jump to the full /search results page */}
            {query.trim() && (
              <div className="border-t border-mag-border px-4 py-3">
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold-400 transition-colors hover:text-gold-300 focus:outline-none focus-visible:underline"
                >
                  View all results
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
