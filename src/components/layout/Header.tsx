"use client";

import { useState, useEffect, useCallback, useRef, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/constants";
import MagneticHover from "@/components/animations/MagneticHover";
import ThemeToggle from "@/components/layout/ThemeToggle";
import NavDropdown from "./NavDropdown";
import { MobileNav } from "./MobileNav";
import SearchModal from "./SearchModal";
import {
  NavActivePill,
  NavLetters,
  NavShine,
  PremiumNavStyles,
} from "./NavPremium";

function NavItem({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "premium-nav-item relative flex items-center rounded-full px-3 py-2 transition-colors duration-300",
        !isActive && "hover:bg-white/[0.04]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isActive && <NavActivePill />}
      <NavShine />
      <NavLetters
        label={label}
        hovered={isHovered}
        tone={isActive ? "active" : isHovered ? "bright" : "muted"}
      />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Publish the header's live rendered height as a CSS var so anything sticky
  // beneath it (e.g. NewsletterStickyBar) can sit flush against it without a
  // hardcoded pixel guess — this keeps them in sync through the scroll-condense
  // height transition instead of drifting into a gap.
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cursor spotlight inside the nav rail — driven straight through the DOM
  // (no React state) so mousemove never re-renders the header.
  const navRailRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLSpanElement>(null);
  const handleRailMove = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    const rail = navRailRef.current;
    const spot = spotRef.current;
    if (!rail || !spot) return;
    const rect = rail.getBoundingClientRect();
    spot.style.transform = `translate(${e.clientX - rect.left - 56}px, -50%)`;
    spot.style.opacity = "1";
  }, []);
  const handleRailLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.opacity = "0";
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Global Cmd/Ctrl-K opens the search modal (the modal owns its own Escape close).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (!isCmdK) return;

      // Don't hijack Cmd/Ctrl-K while the user is typing in a field.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      e.preventDefault();
      setIsSearchOpen(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <PremiumNavStyles />
      <motion.header
        ref={headerRef}
        className={cn(
          // Perf: backdrop-blur re-rasterises the content behind it every scroll
          // frame. Once scrolled the bar is 95% opaque and the blur is invisible,
          // so we only keep it at rest at the very top (over the hero) and drop it
          // during scroll — which is exactly when smoothness matters.
          "sticky top-0 z-50 transition-colors duration-300",
          isScrolled ? "bg-mag-black/95" : "bg-mag-black/80 backdrop-blur-xl"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] sm:px-6 lg:px-8",
            isScrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
          )}
        >
          {/* Logo.

              The artwork is light-on-transparent, so it reads on the near-black
              header without a CSS filter — no filtered compositing layer in
              chrome that is on screen for every route.

              /logomagazine.png is baked by scripts/bake-logo.mjs rather than
              used as uploaded: the wordmark is centred on a SQUARE canvas at
              the same height-to-canvas ratio the previous mark had. That is
              what keeps `h-[3.125rem] w-auto` rendering it at its intended
              size, and it is load-bearing for the sweep below — a non-square
              canvas would shrink the mark here and pull the mask out of
              register with it. Re-run that script if the artwork is replaced.

              Around it: a gold aura that breathes on opacity alone, and on
              hover a specular sweep masked to the glyph itself plus a few
              rising motes. The sweep uses the logo as a mask so the light
              travels across the letterforms rather than across a rectangle. */}
          <Link href="/" className="brand relative flex-shrink-0 group" aria-label="SPX Magazine">
            <span aria-hidden className="brand-aura" />
            <motion.div
              className="brand-inner relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Image
                src="/logomagazine.png"
                alt="SPX Magazine"
                width={120}
                height={40}
                className="h-[3.125rem] w-auto"
                priority
              />
              <span aria-hidden className="brand-sweep" />
            </motion.div>
            <span aria-hidden className="brand-motes">
              <i style={{ ["--x" as string]: "14%", ["--d" as string]: "0s" }} />
              <i style={{ ["--x" as string]: "38%", ["--d" as string]: "0.18s" }} />
              <i style={{ ["--x" as string]: "63%", ["--d" as string]: "0.36s" }} />
              <i style={{ ["--x" as string]: "84%", ["--d" as string]: "0.1s" }} />
            </span>
          </Link>

          {/* Desktop Navigation — glass rail with living rim + cursor spotlight */}
          <nav
            ref={navRailRef}
            onMouseMove={handleRailMove}
            onMouseLeave={handleRailLeave}
            className="relative hidden items-center rounded-full bg-white/[0.03] px-1 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:flex"
          >
            <span aria-hidden className="nav-rim pointer-events-none" />
            <span
              ref={spotRef}
              aria-hidden
              className="nav-spot pointer-events-none absolute left-0 top-1/2 h-28 w-28 rounded-full opacity-0 transition-opacity duration-300"
              style={{ transform: "translate(-9999px, -50%)" }}
            />
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <MagneticHover key={item.href} strength={0.2}>
                  {item.children ? (
                    <NavDropdown item={item} isActive={isActive} />
                  ) : (
                    <NavItem
                      href={item.href}
                      label={item.label}
                      isActive={isActive}
                    />
                  )}
                </MagneticHover>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <MagneticHover strength={0.4}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-mag-muted ring-1 ring-inset ring-transparent transition-all duration-300 hover:bg-mag-dark hover:text-gold-400 hover:ring-gold-400/30"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </motion.div>
            </MagneticHover>

            <MagneticHover strength={0.4} className="hidden sm:block">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}>
                <Link
                  href="/bookmarks"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-mag-muted ring-1 ring-inset ring-transparent transition-all duration-300 hover:bg-mag-dark hover:text-gold-400 hover:ring-gold-400/30"
                  aria-label="Bookmarks"
                >
                  <Bookmark className="h-4 w-4" />
                </Link>
              </motion.div>
            </MagneticHover>

            <MagneticHover strength={0.4} className="hidden sm:block">
              <ThemeToggle />
            </MagneticHover>

            <motion.button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-mag-muted transition-colors hover:bg-mag-dark hover:text-gold-400 lg:hidden"
              aria-label="Open menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Bottom hairline — static gold base with a slow travelling glint */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
        >
          <span className="absolute inset-0 bg-gold-400/20" />
          <span className="nav-hairline-glint absolute inset-y-0 left-0 w-1/3" />
        </span>
      </motion.header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <style>{`
        .brand { display: inline-block; isolation: isolate; }
        .brand-inner { position: relative; z-index: 1; }

        /* A pool of gold behind the wordmark. Pure gradient, and only its
           opacity moves — no animated filter, so this costs nothing per frame
           in chrome that is on screen for the entire session. */
        .brand-aura {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 190%;
          height: 260%;
          translate: -50% -50%;
          z-index: 0;
          pointer-events: none;
          border-radius: 9999px;
          background: radial-gradient(
            50% 50% at 50% 50%,
            color-mix(in oklab, var(--color-gold-400) 34%, transparent) 0%,
            color-mix(in oklab, var(--color-gold-400) 12%, transparent) 45%,
            transparent 72%
          );
          opacity: 0.5;
          animation: brandBreathe 6s ease-in-out infinite;
        }
        .brand:hover .brand-aura { opacity: 0.85; }

        /* The sweep is masked to the logo itself, so the light travels across
           the letterforms rather than across a rectangle over them. */
        .brand-sweep {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            105deg,
            transparent 38%,
            color-mix(in oklab, #fff6d8 92%, transparent) 50%,
            transparent 62%
          );
          -webkit-mask-image: url("/logomagazine.png");
          mask-image: url("/logomagazine.png");
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          opacity: 0;
          transform: translateX(-120%);
        }
        .brand:hover .brand-sweep {
          opacity: 1;
          transform: translateX(120%);
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
        }

        /* Motes lift off on hover only. Nothing drifts perpetually in chrome
           the reader sees on every page. */
        .brand-motes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .brand-motes i {
          position: absolute;
          left: var(--x);
          bottom: 12%;
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: #fff6d8;
          box-shadow: 0 0 8px 1px color-mix(in oklab, var(--color-gold-300) 85%, transparent);
          opacity: 0;
        }
        .brand:hover .brand-motes i {
          animation: brandMote 1.5s cubic-bezier(0.16, 1, 0.3, 1) var(--d) infinite;
        }

        @keyframes brandBreathe {
          0%, 100% { opacity: 0.42; }
          50%      { opacity: 0.68; }
        }
        @keyframes brandMote {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-26px) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-aura { animation: none; opacity: 0.55; }
          .brand-sweep { display: none; }
          .brand:hover .brand-motes i { animation: none; }
        }
      `}</style>
    </>
  );
}
