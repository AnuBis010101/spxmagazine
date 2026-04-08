"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS } from "@/lib/constants";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[60] flex flex-col bg-mag-black/95 backdrop-blur-xl"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-5">
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

          {/* Nav links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_ITEMS.map((item, index) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
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
                </motion.div>
              );
            })}

            {/* Extra links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
          </nav>

          {/* Bottom section */}
          <div className="px-6 pb-10">
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
