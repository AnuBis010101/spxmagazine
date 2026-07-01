"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
      className="relative flex items-center px-4 py-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover highlight (only when not active) */}
      {!isActive && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-md bg-white/5"
          transition={{ duration: 0.15 }}
        />
      )}

      {/* Text */}
      <span className="relative z-10 overflow-hidden" style={{ height: "1.2em" }}>
        <motion.span
          className={cn(
            "block text-sm font-medium transition-colors duration-200",
            isActive ? "text-gold-400" : isHovered ? "text-white" : "text-mag-muted"
          )}
          animate={
            isHovered && !isActive
              ? { rotateX: [0, -90, 0], y: [0, 4, 0] }
              : { rotateX: 0, y: 0 }
          }
          transition={{
            duration: 0.35,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{ transformOrigin: "50% 100%", display: "inline-block" }}
        >
          {label}
        </motion.span>
      </span>

      {/* Sliding gold underline bar */}
      {isActive && (
        <motion.span
          layoutId="activeNavBar"
          className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gold-400"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <motion.header
        className={cn(
          "sticky top-0 z-50 border-b border-gold-400/20 backdrop-blur-xl transition-colors duration-300",
          isScrolled ? "bg-mag-black/95" : "bg-mag-black/80"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          {/* Logo */}
          <Link href="/" className="relative flex-shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Image
                src="/spxlogo.png"
                alt="SPX Magazine"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <MagneticHover key={item.href} strength={0.25}>
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
                  className="flex h-11 w-11 items-center justify-center rounded-full text-mag-muted transition-colors hover:bg-mag-dark hover:text-gold-400"
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
                  className="flex h-11 w-11 items-center justify-center rounded-full text-mag-muted transition-colors hover:bg-mag-dark hover:text-gold-400"
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
              className="flex h-11 w-11 items-center justify-center rounded-full text-mag-muted transition-colors hover:bg-mag-dark hover:text-gold-400 md:hidden"
              aria-label="Open menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
