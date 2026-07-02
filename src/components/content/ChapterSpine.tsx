"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE, DUR } from "@/lib/motion";

interface Chapter {
  id: string;
  text: string;
}

interface ChapterSpineProps {
  /**
   * Selector or element id (without the leading #) of the prose container to
   * scan for h2 headings. The article detail page gives its prose wrapper
   * id="article-body", which is the default here.
   */
  containerId?: string;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * ChapterSpine — a sticky vertical progress rail rendered in the OUTER left
 * gutter of the article layout (xl+ only). It mirrors the article's H2s as
 * ticks, highlights the active section, drives a scaleY gold fill from scroll
 * progress over the article, and shows the active section title as a rotated
 * vertical label. Purely decorative navigation chrome: it lives in the empty
 * grid gutter and never affects the centered reading column.
 *
 * Reduced motion: renders a plain static thin rail (no fill animation, no
 * rotated label, no scroll subscription).
 */
export default function ChapterSpine({
  containerId = "article-body",
}: ChapterSpineProps) {
  const prefersReducedMotion = useReducedMotion();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Resolve the scroll target (the enclosing <article>) once mounted. Using the
  // article element rather than the whole document keeps progress tied to the
  // reading region, matching how the ticks map to body headings.
  useEffect(() => {
    articleRef.current = wrapperRef.current?.closest("article") ?? null;
    setReady(true);
  }, []);

  // Discover H2 chapters from the prose container after mount. Reuses ids that
  // TableOfContents may have already assigned; assigns any that are still
  // missing with the same slug scheme so tick clicks always have a target.
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const els = container.querySelectorAll<HTMLHeadingElement>("h2");
    const found: Chapter[] = [];

    els.forEach((el) => {
      const text = el.textContent?.trim() ?? "";
      if (!text) return;

      let id = el.id;
      if (!id) {
        id = slugifyHeading(text) || "section";
        let candidate = id;
        let suffix = 0;
        while (document.getElementById(candidate)) {
          suffix++;
          candidate = `${id}-${suffix}`;
        }
        id = candidate;
        el.id = id;
      }

      found.push({ id, text });
    });

    setChapters(found);
  }, [containerId]);

  // Track the active chapter with an IntersectionObserver. rootMargin matches
  // TableOfContents so both indicators agree on the active section.
  useEffect(() => {
    if (chapters.length === 0) return;

    const idToIndex = new Map(chapters.map((c, i) => [c.id, i]));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length > 0) {
          const idx = idToIndex.get(visible[0].target.id);
          if (idx !== undefined) setActiveIndex(idx);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    for (const c of chapters) {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [chapters]);

  // Scroll-driven fill. We read the <article> rect on scroll rather than using
  // useScroll({ target }) because articleRef is resolved via closest() (a DOM
  // node not attached through a React ref), which Framer's useScroll rejects as
  // "not hydrated". A manual motion value avoids that entirely.
  const progress = useMotionValue(0);
  const scaleY = useSpring(progress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (prefersReducedMotion || !ready) return;
    const article = articleRef.current;
    if (!article) return;
    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      progress.set(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefersReducedMotion, ready, chapters.length, progress]);

  const activeChapter = chapters[activeIndex];

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Truncate long titles for the rotated label so it never runs off-screen.
  const label = useMemo(() => {
    const t = activeChapter?.text ?? "";
    return t.length > 42 ? `${t.slice(0, 41)}…` : t;
  }, [activeChapter?.text]);

  // Below xl the gutter collapses — render nothing there. We also render
  // nothing until we know whether there are chapters worth spining.
  if (!ready || chapters.length < 2) {
    // Keep the grid cell occupied so column widths are stable; the actual
    // spine chrome is xl-only anyway.
    return <div className="hidden xl:block" aria-hidden="true" />;
  }

  // Reduced-motion / no-JS-friendly degraded state: a calm static rail, no
  // animated fill, no rotated moving label.
  if (prefersReducedMotion) {
    return (
      <div className="hidden xl:block" aria-hidden="true">
        <div className="sticky top-24 flex justify-center">
          <div className="h-[60vh] w-px bg-mag-border/60" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="hidden xl:block"
      aria-hidden="true"
    >
      <div className="sticky top-24 flex h-[70vh] items-stretch justify-center gap-4">
        {/* Rail + ticks + fill */}
        <div className="relative flex w-6 justify-center">
          {/* Track */}
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-mag-border/50" />
          {/* Progress fill (scaleY from top) */}
          <motion.div
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-top bg-gold-400"
            style={{
              scaleY,
              boxShadow: "0 0 8px rgba(212,175,55,0.5)",
            }}
          />
          {/* Chapter ticks, distributed along the rail */}
          <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col justify-between py-1">
            {chapters.map((c, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleJump(c.id)}
                  aria-label={`Jump to section: ${c.text}`}
                  // Decorative: the whole spine is aria-hidden (the TOC is the
                  // real nav), so keep these out of the tab order too — otherwise
                  // keyboard users hit silent, unnamed focus stops (WCAG 4.1.2).
                  tabIndex={-1}
                  className="group relative flex h-3 w-3 items-center justify-center"
                >
                  <motion.span
                    className={cn(
                      "block rounded-full ring-1 transition-colors",
                      isActive
                        ? "bg-gold-400 ring-gold-400"
                        : isPast
                          ? "bg-gold-400/50 ring-gold-400/40"
                          : "bg-mag-dark ring-mag-border",
                    )}
                    animate={{ scale: isActive ? 1.6 : 1 }}
                    transition={{ duration: DUR.fast, ease: EASE.out }}
                    style={{ width: 6, height: 6 }}
                  />
                  {isActive && (
                    <motion.span
                      layoutId="chapter-spine-halo"
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: "0 0 0 3px rgba(212,175,55,0.18)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rotated active-section label, reads bottom-to-top up the gutter */}
        <div className="relative flex items-center">
          <motion.span
            key={activeChapter?.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, ease: EASE.out }}
            className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-400/70"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {label}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
