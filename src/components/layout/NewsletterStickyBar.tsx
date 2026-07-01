"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NEWSLETTER_SIGNUP_URL } from "@/lib/constants";

/**
 * Slim newsletter signup bar shown at the very top of the homepage, directly
 * below the breaking-news ticker. It matches the ticker's height and sticks
 * flush beneath the (sticky) header — so while the ticker scrolls away, this
 * bar stays put. A subtle "stuck" elevation + a slow gold sheen keep it elegant.
 */
export default function NewsletterStickyBar() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    // Becomes "stuck" once the ticker above it has scrolled out of view.
    const onScroll = () => setStuck(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Homepage only.
  if (pathname !== "/") return null;

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "sticky top-[65px] z-40 overflow-hidden border-b transition-all duration-300 lg:top-[81px]",
        stuck
          ? "border-gold-400/30 shadow-[0_12px_34px_-12px_rgba(212,175,55,0.4)]"
          : "border-gold-400/15"
      )}
    >
      {/* Layered backgrounds: dark blur base + gold wash that intensifies when stuck */}
      <div className="absolute inset-0 bg-mag-black/90 backdrop-blur-xl" />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-gold-600/15 via-gold-400/10 to-gold-600/15 transition-opacity duration-300",
          stuck ? "opacity-100" : "opacity-60"
        )}
      />

      {/* Slow gold sheen sweep */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-gold-200/15 to-transparent"
        initial={{ x: "-200%" }}
        animate={{ x: "500%" }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3.5 }}
      />

      {/* Content */}
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-center gap-2.5 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Sparkles className="hidden h-3.5 w-3.5 flex-shrink-0 text-gold-400 sm:block" />

        <p className="whitespace-nowrap text-xs font-medium text-mag-light sm:text-sm">
          <span className="hidden sm:inline">SPX news in your inbox </span>
          <span className="sm:hidden">SPX news </span>
          <span className="font-semibold text-gold-gradient">every week</span>
        </p>

        <a
          href={NEWSLETTER_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-6 flex-shrink-0 items-center gap-1 rounded-full bg-gold-400 px-3 text-[11px] font-semibold text-mag-black transition-colors hover:bg-gold-500 sm:text-xs"
        >
          Subscribe
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.div>
  );
}
