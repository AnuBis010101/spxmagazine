'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PostForm from '@/components/admin/PostForm';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Post, Category } from '@/types/content';

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/admin/posts?id=${id}`);
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { post, categories } = await res.json();
      if (!post) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(post as Post);
      setCategories((categories as Category[]) || []);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <h1 className="text-xl font-display font-bold text-white mb-2">
          Post Not Found
        </h1>
        <p className="text-mag-muted mb-6">
          The post you are looking for does not exist.
        </p>
        <Link
          href="/admin/posts"
          className="text-gold-400 hover:underline text-sm"
        >
          Back to Posts
        </Link>
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
          Edit Post
        </h1>
      </div>

      <PostForm post={post!} categories={categories} />
    </div>
  );
}
