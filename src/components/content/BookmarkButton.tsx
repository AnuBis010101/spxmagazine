"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils/cn";

interface BookmarkButtonProps {
  slug: string;
  className?: string;
}

export default function BookmarkButton({ slug, className }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const active = isBookmarked(slug);

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(slug);
      }}
      whileTap={{ scale: 0.9 }}
      animate={active ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
        active
          ? "text-[#D4AF37] hover:bg-[#D4AF37]/10"
          : "text-mag-muted hover:text-[#D4AF37] hover:bg-white/5",
        className,
      )}
      aria-label={active ? "Remove bookmark" : "Bookmark this article"}
      title={active ? "Remove bookmark" : "Bookmark this article"}
    >
      {active ? (
        <BookmarkCheck className="w-4 h-4" fill="currentColor" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </motion.button>
  );
}
