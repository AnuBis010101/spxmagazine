import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => `${basePath}?page=${page}`;

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  const buttonBase =
    "inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className={cn(
            buttonBase,
            "text-mag-muted hover:text-white hover:bg-mag-border"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className={cn(buttonBase, "text-mag-muted/30 cursor-not-allowed")}
          aria-disabled="true"
        >
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className={cn(buttonBase, "text-mag-muted cursor-default")}
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={cn(
              buttonBase,
              page === currentPage
                ? "bg-gold-400 text-mag-black font-bold"
                : "text-mag-muted hover:text-white hover:bg-mag-border"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className={cn(
            buttonBase,
            "text-mag-muted hover:text-white hover:bg-mag-border"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className={cn(buttonBase, "text-mag-muted/30 cursor-not-allowed")}
          aria-disabled="true"
        >
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
