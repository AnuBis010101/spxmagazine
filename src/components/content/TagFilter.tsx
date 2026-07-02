'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SPRING } from '@/lib/motion';

interface TagFilterProps {
  tags: string[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

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

  const items: { key: string; label: string; value: string | null }[] = [
    { key: '__all__', label: 'All', value: null },
    ...tags.map((tag) => ({ key: tag, label: `#${tag}`, value: tag })),
  ];

  const isSelected = (value: string | null) =>
    value === null ? !activeTag : activeTag === value;

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {items.map((item) => {
        const selected = isSelected(item.value);
        return (
          <button
            key={item.key}
            onClick={() =>
              setTag(item.value !== null && item.value === activeTag ? null : item.value)
            }
            className={`relative px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selected
                ? 'text-mag-black'
                : 'bg-mag-dark border border-mag-border text-mag-muted hover:border-gold-400/50 hover:text-white'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="activeTagPill"
                className="absolute inset-0 rounded-full bg-gold-400"
                style={{ zIndex: -1 }}
                transition={reduce ? { duration: 0 } : SPRING.snappy}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
