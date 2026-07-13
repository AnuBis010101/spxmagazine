"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/lib/constants";

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
        className="relative flex items-center gap-1 px-3 py-1.5"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="relative z-10 overflow-hidden" style={{ height: "1.2em" }}>
          <span
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              isActive ? "text-gold-400" : open ? "text-white" : "text-mag-muted"
            )}
          >
            {item.label}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-all duration-200",
            isActive ? "text-gold-400" : open ? "text-white" : "text-mag-muted",
            open && "rotate-180"
          )}
        />

        {isActive && (
          <motion.span
            layoutId="activeNavBar"
            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gold-400"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={{
              closed: reduce
                ? { opacity: 0 }
                : { opacity: 0, scaleY: 0.85 },
              open: reduce
                ? {
                    opacity: 1,
                    transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
                  }
                : {
                    opacity: 1,
                    scaleY: 1,
                    transition: {
                      duration: 0.22,
                      ease: [0.16, 1, 0.3, 1],
                      staggerChildren: 0.028,
                      delayChildren: 0.04,
                    },
                  },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ transformOrigin: "top center" }}
            className="absolute left-1/2 top-full z-50 mt-2 min-w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-gold-400/20 bg-mag-dark/95 p-1.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          >
            {children.map((child) => {
              const active = isChildActive(child.href, siblingHrefs, pathname);
              return (
                <motion.div
                  key={`${child.label}-${child.href}`}
                  variants={{
                    closed: reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: -6 },
                    open: reduce
                      ? { opacity: 1 }
                      : {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                        },
                  }}
                >
                  <Link
                    href={child.href}
                    className={cn(
                      "block whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-gold-400/10 text-gold-400"
                        : "text-mag-light hover:bg-white/5 hover:text-gold-400"
                    )}
                  >
                    {child.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
