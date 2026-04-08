'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface TagFilterProps {
  tags: string[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTag = useCallback(
    (tag: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tag) {
        params.set('tag', tag);
      } else {
        params.delete('tag');
      }
      params.delete('page'); // reset pagination when filtering
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <button
        onClick={() => setTag(null)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          !activeTag
            ? 'bg-gold-400 text-mag-black'
            : 'bg-mag-dark border border-mag-border text-mag-muted hover:border-gold-400/50 hover:text-white'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setTag(tag === activeTag ? null : tag)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            activeTag === tag
              ? 'bg-gold-400 text-mag-black'
              : 'bg-mag-dark border border-mag-border text-mag-muted hover:border-gold-400/50 hover:text-white'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
