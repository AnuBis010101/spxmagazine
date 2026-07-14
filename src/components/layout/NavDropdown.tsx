"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/lib/constants";
import { NavActivePill, NavLetters, NavShine } from "./NavPremium";

/**
 * Determine whether a dropdown child link should render as active for the
 * current path. Child hrefs can be prefixes of one another (e.g. "/articles"
 * and "/articles/magazine"), so a naive startsWith would light up both — we
 * match the most specific sibling instead.
 */
function isChildActive(childHref: string, siblingHrefs: string[], pathname: string): boolean {
  if (pathname === childHref) return true;
  if (!pathname.startsWith(childHref === "/" ? "/" : childHref + "/")) return false;
  // Active only if no more-specific sibling is a better prefix match.
  return !siblingHrefs.some(
    (other) =>
      other !== childHref &&
      other.length > childHref.length &&
      (pathname === other || pathname.startsWith(other + "/"))
  );
}

export default function NavDropdown({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const children = item.children ?? [];
  const siblingHrefs = children.map((c) => c.href);

  const openNow = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  // Small close delay so diagonal cursor moves into the panel don't dismiss it.
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href={item.href}
        aria-label={item.label}
        className={cn(
          "premium-nav-item relative flex items-center gap-1 rounded-full px-3 py-2 transition-colors duration-300",
          !isActive && "hover:bg-white/[0.04]"
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {isActive && <NavActivePill />}
        <NavShine />
        <NavLetters
          label={item.label}
          hovered={open}
          tone={isActive ? "active" : open ? "bright" : "muted"}
        />
        <ChevronDown
          className={cn(
            "relative z-10 h-3.5 w-3.5 transition-all duration-300",
            isActive ? "text-gold-400" : open ? "text-white" : "text-mag-muted",
            open && "rotate-180"
          )}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={{
              closed: reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.96 },
              open: reduce
                ? {
                    opacity: 1,
                    transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
                  }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                      staggerChildren: 0.045,
                      delayChildren: 0.05,
                    },
                  },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ transformOrigin: "top center" }}
            className="nav-panel-rim absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-2xl p-px shadow-[0_24px_60px_-16px_rgba(0,0,0,0.85)]"
          >
            <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-mag-dark/[0.985] p-1.5">
              {/* faint top light-catch inside the panel */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gold-400/[0.06] to-transparent"
              />

              {children.map((child) => {
                const active = isChildActive(child.href, siblingHrefs, pathname);
                return (
                  <motion.div
                    key={`${child.label}-${child.href}`}
                    variants={{
                      closed: reduce ? { opacity: 0 } : { opacity: 0, y: -6 },
                      open: reduce
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                          },
                    }}
                  >
                    <Link
                      href={child.href}
                      className={cn(
                        "group/row relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200",
                        active ? "bg-gold-400/10" : "hover:bg-white/[0.05]"
                      )}
                    >
                      {/* dot marker */}
                      <span
                        aria-hidden
                        className={cn(
                          "h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-300",
                          active
                            ? "bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.9)]"
                            : "bg-mag-muted/40 group-hover/row:scale-125 group-hover/row:bg-gold-400 group-hover/row:shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                        )}
                      />
                      <span className="min-w-0 flex-1 transition-transform duration-300 group-hover/row:translate-x-0.5">
                        <span
                          className={cn(
                            "block font-display text-sm font-medium transition-colors duration-200",
                            active
                              ? "text-gold-400"
                              : "text-mag-light group-hover/row:text-gold-400"
                          )}
                        >
                          {child.label}
                        </span>
                        {child.desc && (
                          <span className="mt-0.5 block truncate text-xs text-mag-muted/80">
                            {child.desc}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className={cn(
                          "h-3.5 w-3.5 flex-shrink-0 text-gold-400 transition-all duration-300",
                          active
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1.5 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100"
                        )}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
