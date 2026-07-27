"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/constants";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

/* Springy glide-in, then a smooth accelerating fade-and-slide on the way out
   so the panel gets out of the way and reveals the new page cleanly. */
const panelTransition = {
  enter: { type: "spring", damping: 32, stiffness: 340, mass: 0.9 },
  exit: { duration: 0.42, ease: "circIn" },
} as const;

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, panelRef);

  // Backstop: if a tap navigates before onClose lands (or the click is missed),
  // dismiss the overlay as soon as the route actually changes so it never sits
  // on top of the new page.
  const routeAtRender = useRef(pathname);
  useEffect(() => {
    if (pathname !== routeAtRender.current) {
      routeAtRender.current = pathname;
      if (isOpen) onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Escape closes; lock the page scroll while the menu owns the screen.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ x: "100%", opacity: 0.4 }}
          animate={{ x: 0, opacity: 1, transition: panelTransition.enter }}
          exit={{ x: "100%", opacity: 0, transition: panelTransition.exit }}
          className="fixed inset-0 z-[60] flex flex-col bg-mag-black/95 backdrop-blur-xl focus:outline-none"
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-center justify-between px-6 py-5">
            <Image
              src="/spxlogo.png"
              alt="SPX Magazine"
              width={100}
              height={33}
              className="h-8 w-auto"
            />
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-mag-muted transition-colors hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Nav links.
              The list is taller than a phone screen, so this has to scroll.
              min-h-0 lets the flex child actually shrink (without it the nav
              keeps its content height and overflows the panel), and the inner
              min-h-full wrapper keeps the links centred when they DO fit —
              justify-center on the scroll container itself would make the
              overflowing top items unreachable. */}
          <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="flex min-h-full flex-col items-center justify-center gap-8 px-6 py-8">
            {NAV_ITEMS.map((item, index) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex flex-col items-center gap-3"
                >
                  {item.children ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "font-display text-2xl font-semibold transition-colors",
                        isActive ? "text-gold-400" : "text-white hover:text-gold-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "font-display text-2xl font-semibold transition-colors",
                        isActive
                          ? "text-gold-400"
                          : "text-white hover:text-gold-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.children && (
                    <div className="flex flex-col items-center gap-2.5">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={`${child.label}-${child.href}`}
                            href={child.href}
                            onClick={onClose}
                            className={cn(
                              "font-body text-base transition-colors",
                              childActive
                                ? "text-gold-400"
                                : "text-mag-muted hover:text-white"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Extra links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } }}
              transition={{ delay: 0.1 + NAV_ITEMS.length * 0.05 }}
            >
              <Link
                href="/bookmarks"
                onClick={onClose}
                className={cn(
                  "font-display text-2xl font-semibold transition-colors",
                  pathname === "/bookmarks"
                    ? "text-gold-400"
                    : "text-white hover:text-gold-400"
                )}
              >
                Bookmarks
              </Link>
            </motion.div>
            </div>
          </nav>

          {/* Bottom section — pad past the iPhone home indicator */}
          <div className="shrink-0 px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
            <div className="flex justify-center mb-4">
              <ThemeToggle />
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
            <p className="mt-4 text-center text-xs text-mag-muted">
              &copy; {new Date().getFullYear()} SPX Magazine
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
