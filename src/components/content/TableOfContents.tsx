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
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => scrollTo(h.id)}
              className={cn(
                "w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors border-l-2",
                h.level === 3 && "ml-4",
                activeId === h.id
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                  : "border-transparent text-mag-muted hover:text-white hover:bg-white/5",
              )}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar panel */}
      <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl bg-mag-dark/80 backdrop-blur-md border border-mag-border/50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-mag-muted mb-3 flex items-center gap-2">
          <List className="w-3.5 h-3.5" />
          Table of Contents
        </p>
        {tocList}
      </div>

      {/* Mobile: collapsible dropdown at top */}
      <div className="lg:hidden mb-6 rounded-xl bg-mag-dark/80 backdrop-blur-md border border-mag-border/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-mag-muted uppercase tracking-wider"
        >
          <span className="flex items-center gap-2">
            <List className="w-3.5 h-3.5" />
            Table of Contents
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              mobileOpen && "rotate-180",
            )}
          />
        </button>
        {mobileOpen && <div className="px-4 pb-4">{tocList}</div>}
      </div>
    </>
  );
}
