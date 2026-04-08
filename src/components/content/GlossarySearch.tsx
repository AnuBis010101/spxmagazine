"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, X, BookOpen, Sparkles } from "lucide-react";
import type { GlossaryTerm } from "@/types/content";

interface GlossarySearchProps {
  terms: GlossaryTerm[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

/* ── Animated Term Card ─────────────────────────────────────── */
function TermCard({ term, index }: { term: GlossaryTerm; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.4),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-mag-border bg-gradient-to-br from-mag-dark via-mag-dark to-mag-black p-6 transition-all duration-500 hover:border-gold-400/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>

        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-400/0 group-hover:w-full transition-all duration-700" />

        <div className="relative z-10">
          {/* Term header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-white group-hover:text-gold-400 transition-colors duration-300 leading-tight">
              {term.term}
            </h3>
            {term.category && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-gold-400/60 bg-gold-400/[0.08] border border-gold-400/10 rounded-full px-2.5 py-1">
                {term.category}
              </span>
            )}
          </div>

          {/* Definition */}
          <p className="mt-3 text-sm leading-relaxed text-mag-muted group-hover:text-mag-light transition-colors duration-300">
            {term.definition}
          </p>

          {/* Related terms */}
          {term.related_terms && term.related_terms.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {term.related_terms.map((related) => (
                <button
                  key={related}
                  onClick={() => {
                    const letter = related.charAt(0).toUpperCase();
                    const el = document.getElementById(`letter-${letter}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="text-[11px] text-gold-400/50 hover:text-gold-400 border border-gold-400/10 hover:border-gold-400/30 rounded-full px-2 py-0.5 transition-all duration-200"
                >
                  {related}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Letter Section Header ──────────────────────────────────── */
function LetterHeader({ letter }: { letter: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      id={`letter-${letter}`}
      className="scroll-mt-32 flex items-center gap-4 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <span className="font-display text-5xl md:text-6xl font-black bg-gradient-to-b from-gold-400 via-gold-400/80 to-gold-400/30 bg-clip-text text-transparent">
          {letter}
        </span>
        <div className="absolute -inset-2 bg-gold-400/5 rounded-xl blur-xl -z-10" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-gold-400/30 via-gold-400/10 to-transparent" />
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function GlossarySearch({ terms }: GlossarySearchProps) {
  const [query, setQuery] = useState("");
  const [focusedLetter, setFocusedLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return terms;
    const q = query.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [terms, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const term of filtered) {
      const firstChar = term.term.charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";
      const existing = map.get(letter) ?? [];
      existing.push(term);
      map.set(letter, existing);
    }
    return map;
  }, [filtered]);

  const activeLetters = useMemo(() => new Set(grouped.keys()), [grouped]);

  return (
    <div className="mt-10">
      {/* ── Search Bar ──────────────────────────────────────── */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative group">
          {/* Glow behind search */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gold-400/20 via-gold-400/10 to-gold-400/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center bg-mag-dark border border-mag-border rounded-2xl group-focus-within:border-gold-400/40 transition-all duration-300">
            <Search className="ml-5 w-5 h-5 text-mag-muted group-focus-within:text-gold-400 transition-colors shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search expressions, terms, or concepts..."
              className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-mag-muted/60 focus:outline-none text-base"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery("")}
                  className="mr-4 p-1 text-mag-muted hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Result count */}
        <AnimatePresence>
          {query && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center text-sm text-mag-muted mt-3"
            >
              {filtered.length} {filtered.length === 1 ? "result" : "results"} found
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-mag-muted">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-gold-400/60" />
          <span>{terms.length} expressions</span>
        </div>
        <div className="w-px h-4 bg-mag-border" />
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold-400/60" />
          <span>The SPX6900 Lore</span>
        </div>
      </div>

      {/* ── Letter Navigation ──────────────────────────────── */}
      <nav className="mt-8 flex flex-wrap justify-center gap-1">
        {ALPHABET.map((letter) => {
          const isActive = activeLetters.has(letter);
          const isFocused = focusedLetter === letter;

          return (
            <button
              key={letter}
              onMouseEnter={() => setFocusedLetter(letter)}
              onMouseLeave={() => setFocusedLetter(null)}
              onClick={() => {
                if (!isActive) return;
                const el = document.getElementById(`letter-${letter}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`
                relative w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200
                ${
                  isActive
                    ? "text-white hover:text-gold-400 cursor-pointer"
                    : "text-mag-muted/20 cursor-default"
                }
              `}
            >
              {isActive && isFocused && (
                <motion.div
                  layoutId="letterHover"
                  className="absolute inset-0 bg-gold-400/10 border border-gold-400/20 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{letter}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Term Sections ──────────────────────────────────── */}
      <div className="mt-14 space-y-16">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={query}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-16"
            >
              {ALPHABET.filter((letter) => grouped.has(letter)).map((letter) => (
                <div key={letter}>
                  <LetterHeader letter={letter} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grouped.get(letter)!.map((term, i) => (
                      <TermCard key={term.id} term={term} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-gold-400/5 border border-gold-400/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-gold-400/40" />
              </div>
              <p className="text-mag-muted text-lg">No expressions match your search.</p>
              <button
                onClick={() => setQuery("")}
                className="mt-3 text-sm text-gold-400/60 hover:text-gold-400 transition-colors"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
