"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
}

interface TooltipState {
  term: string;
  definition: string;
  slug: string;
  x: number;
  y: number;
  align: "left" | "center" | "right";
}

/**
 * Wraps a prose-magazine container and auto-highlights glossary terms.
 * Fetches terms from /api/glossary so admin edits are automatically reflected.
 */
export default function GlossaryHighlighter({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const termsRef = useRef<GlossaryEntry[]>([]);

  // Fetch glossary terms
  useEffect(() => {
    let cancelled = false;
    fetch("/api/glossary")
      .then((r) => r.json())
      .then((data: GlossaryEntry[]) => {
        if (!cancelled) {
          termsRef.current = data;
          highlightTerms(data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightTerms = useCallback((terms: GlossaryEntry[]) => {
    const container = containerRef.current;
    if (!container || terms.length === 0) return;

    // Build a regex matching all terms (longest first to avoid partial matches)
    const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
    const escaped = sorted.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

    // Map term lowercase -> entry for fast lookup
    const termMap = new Map<string, GlossaryEntry>();
    terms.forEach((t) => termMap.set(t.term.toLowerCase(), t));

    // Walk text nodes within the prose container
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        // Skip if already highlighted, or inside links/headings/code
        if (parent.closest("[data-glossary]") || parent.closest("a") || parent.closest("h1,h2,h3,h4,h5,h6") || parent.closest("code,pre")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Track which terms have been highlighted (only highlight first occurrence)
    const highlighted = new Set<string>();

    textNodes.forEach((textNode) => {
      const text = textNode.textContent || "";
      regex.lastIndex = 0;
      const matches: { index: number; length: number; term: string }[] = [];

      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const lower = match[1].toLowerCase();
        if (!highlighted.has(lower)) {
          matches.push({ index: match.index, length: match[1].length, term: match[1] });
          highlighted.add(lower);
        }
      }

      if (matches.length === 0) return;

      const frag = document.createDocumentFragment();
      let lastIdx = 0;

      matches.forEach(({ index, length, term }) => {
        // Add text before match
        if (index > lastIdx) {
          frag.appendChild(document.createTextNode(text.slice(lastIdx, index)));
        }

        // Create highlighted span
        const span = document.createElement("span");
        span.setAttribute("data-glossary", term.toLowerCase());
        span.className = "glossary-term";
        span.textContent = text.slice(index, index + length);
        frag.appendChild(span);

        lastIdx = index + length;
      });

      // Add remaining text
      if (lastIdx < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIdx)));
      }

      textNode.parentNode?.replaceChild(frag, textNode);
    });
  }, []);

  // Handle hover events via delegation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.hasAttribute("data-glossary")) return;

      clearTimeout(hideTimeout.current);
      const termKey = target.getAttribute("data-glossary")!;
      const entry = termsRef.current.find((t) => t.term.toLowerCase() === termKey);
      if (!entry) return;

      const rect = target.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const centerX = rect.left + rect.width / 2;

      let align: "left" | "center" | "right" = "center";
      if (centerX < 160) align = "left";
      else if (centerX > viewportW - 160) align = "right";

      setTooltip({
        term: entry.term,
        definition: entry.definition,
        slug: entry.slug,
        x: centerX,
        y: rect.top,
        align,
      });
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.hasAttribute("data-glossary")) return;
      hideTimeout.current = setTimeout(() => setTooltip(null), 200);
    };

    container.addEventListener("mouseenter", handleMouseEnter, true);
    container.addEventListener("mouseleave", handleMouseLeave, true);

    // Touch support: tap to toggle
    const handleTouch = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.hasAttribute("data-glossary")) return;
      e.preventDefault();
      handleMouseEnter(e);
      hideTimeout.current = setTimeout(() => setTooltip(null), 4000);
    };
    container.addEventListener("touchstart", handleTouch, { passive: false });

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter, true);
      container.removeEventListener("mouseleave", handleMouseLeave, true);
      container.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {children}

      {/* Tooltip portal */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="fixed z-[100] pointer-events-auto"
            style={{
              left: tooltip.align === "left" ? tooltip.x - 10 : tooltip.align === "right" ? tooltip.x - 270 : tooltip.x - 140,
              top: tooltip.y - 8,
            }}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onMouseEnter={() => clearTimeout(hideTimeout.current)}
            onMouseLeave={() => { hideTimeout.current = setTimeout(() => setTooltip(null), 150); }}
          >
            <div
              className="w-[280px] rounded-xl border border-gold-400/20 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.1)]"
              style={{
                backgroundColor: "rgba(20, 20, 20, 0.95)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                transform: "translateY(-100%)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display font-bold text-sm text-gold-400">{tooltip.term}</h4>
                <span className="text-[9px] uppercase tracking-wider text-gold-400/40 font-display mt-0.5">Glossary</span>
              </div>
              <p className="text-xs text-mag-muted leading-relaxed mt-2 line-clamp-3">
                {tooltip.definition}
              </p>
              <Link
                href={`/glossary#${tooltip.slug}`}
                className="inline-block mt-2 text-[10px] uppercase tracking-wider text-gold-400/60 hover:text-gold-400 transition-colors font-display"
              >
                Learn more &rarr;
              </Link>

              {/* Arrow */}
              <div
                className="absolute bottom-0 w-2 h-2 border-r border-b border-gold-400/20 rotate-45"
                style={{
                  backgroundColor: "rgba(20, 20, 20, 0.95)",
                  left: tooltip.align === "left" ? 20 : tooltip.align === "right" ? 260 : 136,
                  transform: "translateY(50%) rotate(45deg)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
