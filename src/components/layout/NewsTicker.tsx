import Link from 'next/link';
import type { Post } from '@/types/content';

interface NewsTickerProps {
  posts: Post[];
}

const CONTENT_PATH: Record<string, string> = {
  news: '/news/',
  article: '/articles/',
  learn: '/learn/',
};

export function NewsTicker({ posts }: NewsTickerProps) {
  if (!posts.length) return null;

  // A seamless marquee needs the strip duplicated so the loop has no visible
  // seam. With a single item there's nothing to scroll, so hold it static; with
  // 2+ we run the non-stop loop (the ticker is fed the latest published posts, so
  // in practice this is always scrolling).
  const marquee = posts.length >= 2;
  const items = marquee ? [...posts, ...posts] : posts;

  return (
    <div className="bg-mag-dark border-b border-mag-border overflow-hidden flex items-stretch">
      {/* Label */}
      <div className="flex-shrink-0 flex items-center gap-2 bg-gold-400 px-4 py-2 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-mag-black animate-pulse" />
        <span className="text-xs font-bold text-mag-black uppercase tracking-widest whitespace-nowrap">
          Breaking
        </span>
      </div>

      {/* Scrolling strip (marquee at >=3, static headline below that).
          Edge fade mask + content-proportional duration only in marquee mode. */}
      <div
        className="flex-1 overflow-hidden relative"
        style={
          marquee
            ? {
                maskImage:
                  "linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent)",
              }
            : undefined
        }
      >
        <div
          className={`flex whitespace-nowrap py-2 ${marquee ? "animate-ticker" : ""}`}
          style={marquee ? { animationDuration: `${posts.length * 4}s` } : undefined}
        >
          {items.map((post, i) => (
            <Link
              key={`${post.id}-${i}`}
              href={`${CONTENT_PATH[post.content_type] ?? '/articles/'}${post.slug}`}
              className="inline-flex items-center gap-2 px-6 text-sm text-mag-muted hover:text-white transition-colors flex-shrink-0"
            >
              <span className="w-1 h-1 rounded-full bg-gold-400/60 flex-shrink-0" />
              {post.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
