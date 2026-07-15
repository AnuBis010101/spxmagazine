"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TableOfContents({
  contentSelector = ".prose-magazine",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Discover headings on mount
  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const elements = container.querySelectorAll("h2, h3");
    const found: Heading[] = [];

    elements.forEach((el) => {
      const text = el.textContent?.trim() ?? "";
      if (!text) return;

      // Generate and assign an ID if missing
      let id = el.id;
      if (!id) {
        id = slugifyHeading(text);
        // Deduplicate
        let suffix = 0;
        let candidate = id;
        while (document.getElementById(candidate)) {
          suffix++;
          candidate = `${id}-${suffix}`;
        }
        id = candidate;
        el.id = id;
      }

      found.push({
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(found);
  }, [contentSelector]);

  // IntersectionObserver for active tracking
  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current?.disconnect();

    const callback: IntersectionObserverCallback = (entries) => {
      // Find the first heading that is intersecting (top-most visible)
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
        setMobileOpen(false);
      }
    },
    [],
  );

  // Only render if 3+ headings
  if (headings.length < 3) return null;

  const tocList = (
    <nav aria-label="Table of contents">
      <ul className="space-y-0.5">
        {headings.map((h) => {
          const active = activeId === h.id;
          return (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => scrollTo(h.id)}
                title={h.text}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "group/toc relative block w-full rounded-lg py-1.5 pl-3.5 pr-2 text-left transition-colors duration-200",
                  h.level === 3 ? "pl-6 text-[12px]" : "text-[13px]",
                  active
                    ? "bg-gold-400/[0.07] font-medium text-gold-300"
                    : "text-mag-muted hover:bg-white/[0.035] hover:text-mag-light",
                )}
              >
                {/* active accent bar in the item's left edge */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-[3px] left-0 w-[2px] rounded-full transition-all duration-300",
                    active
                      ? "bg-gradient-to-b from-gold-300 to-gold-500 opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.55)]"
                      : "bg-mag-border opacity-0 group-hover/toc:opacity-60",
                  )}
                />
                <span className="block line-clamp-3 break-words leading-[1.35]">
                  {h.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar panel */}
      <div className="toc-scroll hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-mag-border/60 bg-gradient-to-b from-mag-dark/90 to-mag-black/85 p-3 shadow-[0_10px_34px_-16px_rgba(0,0,0,0.75)]">
        <p className="mb-2.5 flex items-center gap-2 px-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-mag-muted/90">
          <List className="h-3.5 w-3.5 text-gold-400/80" />
          On this page
        </p>
        {tocList}
      </div>

      {/* Mobile: collapsible dropdown at top */}
      <div className="lg:hidden mb-6 overflow-hidden rounded-2xl border border-mag-border/60 bg-mag-dark/90">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider text-mag-muted"
        >
          <span className="flex items-center gap-2">
            <List className="h-3.5 w-3.5 text-gold-400/80" />
            On this page
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              mobileOpen && "rotate-180",
            )}
          />
        </button>
        {mobileOpen && <div className="px-3 pb-3">{tocList}</div>}
      </div>

      {/* thin, unobtrusive scrollbar for the sticky panel */}
      <style>{`
        .toc-scroll { scrollbar-width: thin; scrollbar-color: color-mix(in oklab, var(--color-gold-400) 30%, transparent) transparent; }
        .toc-scroll::-webkit-scrollbar { width: 6px; }
        .toc-scroll::-webkit-scrollbar-track { background: transparent; }
        .toc-scroll::-webkit-scrollbar-thumb { background: color-mix(in oklab, var(--color-gold-400) 26%, transparent); border-radius: 9999px; }
        .toc-scroll::-webkit-scrollbar-thumb:hover { background: color-mix(in oklab, var(--color-gold-400) 45%, transparent); }
      `}</style>
    </>
  );
}
