'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PostForm from '@/components/admin/PostForm';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Category } from '@/types/content';

export default function NewPostPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/admin/posts');
      if (res.ok) {
        const { categories } = await res.json();
        setCategories((categories as Category[]) || []);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 text-sm text-mag-muted hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">
          Create Post
        </h1>
      </div>

      <PostForm categories={categories} />
    </div>
  );
}
