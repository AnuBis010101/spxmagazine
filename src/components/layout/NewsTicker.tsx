import Link from 'next/link';
import type { Post } from '@/types/content';

interface NewsTickerProps {
  posts: Post[];
}

export function NewsTicker({ posts }: NewsTickerProps) {
  if (!posts.length) return null;

  // Duplicate items for seamless loop
  const items = [...posts, ...posts];

  return (
    <div className="bg-mag-dark border-b border-mag-border overflow-hidden flex items-stretch">
      {/* Label */}
      <div className="flex-shrink-0 flex items-center gap-2 bg-gold-400 px-4 py-2 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-mag-black animate-pulse" />
        <span className="text-xs font-bold text-mag-black uppercase tracking-widest whitespace-nowrap">
          Breaking
        </span>
      </div>

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex animate-ticker whitespace-nowrap py-2">
          {items.map((post, i) => (
            <Link
              key={`${post.id}-${i}`}
              href={`/news/${post.slug}`}
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
