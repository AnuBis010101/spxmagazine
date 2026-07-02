"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  // Until a real external signup URL is supplied, fall back to the working
  // on-page newsletter form instead of opening a blank "#" tab.
  const isExternal = /^https?:\/\//.test(NEWSLETTER_SIGNUP_URL);
  const href = isExternal ? NEWSLETTER_SIGNUP_URL : "#newsletter";
  const externalProps = isExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "sticky top-[65px] z-40 overflow-hidden border-b transition-all duration-300 lg:top-[81px]",
        stuck
          ? "border-gold-400/30 shadow-[0_8px_24px_-12px_rgba(212,175,55,0.25)]"
          : "border-gold-400/15"
      )}
    >
      {/* Near-solid dark base + gold wash. No backdrop-blur: at 96% opacity it was
          invisible but forced a full-width re-blur of the animated hero every
          scroll frame — a real smoothness cost for zero visual gain. */}
      <div className="absolute inset-0 bg-mag-black/[0.96]" />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-gold-600/15 via-gold-400/10 to-gold-600/15 transition-opacity duration-300",
          stuck ? "opacity-100" : "opacity-60"
        )}
      />

      {/* Content */}
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-center gap-2.5 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Image
          src="/spx6900-coin.png"
          alt=""
          width={14}
          height={14}
          className="hidden h-3.5 w-3.5 flex-shrink-0 object-contain sm:block"
        />

        <p className="whitespace-nowrap text-xs font-medium text-mag-light sm:text-sm">
          <span className="hidden sm:inline">SPX news in your inbox </span>
          <span className="sm:hidden">SPX news </span>
          <span className="font-semibold text-gold-static">every week</span>
        </p>

        <a
          href={href}
          {...externalProps}
          className="group inline-flex h-6 flex-shrink-0 items-center gap-1 rounded-full bg-gold-400 px-3 text-[11px] font-semibold text-mag-black transition-colors hover:bg-gold-500 sm:text-xs"
        >
          Subscribe
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.div>
  );
}
