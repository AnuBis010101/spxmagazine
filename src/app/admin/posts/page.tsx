'use client';
import { adminConfirm } from '@/components/admin/ConfirmProvider';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils/format-date';
import toast from 'react-hot-toast';
import type { Post } from '@/types/content';

const CONTENT_TYPE_TABS = [
  { label: 'All', value: '' },
  { label: 'News', value: 'news' },
  { label: 'Articles', value: 'article' },
  { label: 'Learn', value: 'learn' },
] as const;

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  const supabase = createClient();

  const fetchPosts = async (contentType?: string) => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, category:categories(*)')
      .order('updated_at', { ascending: false });

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to load posts');
      console.error(error);
    } else {
      setPosts((data as Post[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(activeTab || undefined);
  }, [activeTab]);

  const handleDuplicate = async (post: Post) => {
    const newTitle = `${post.title} (Copy)`;
    const newSlug = `${post.slug}-copy-${Date.now().toString(36)}`;

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug,
          excerpt: post.excerpt,
          body: post.body,
          body_html: post.body_html,
          cover_image: post.cover_image,
          cover_image_alt: post.cover_image_alt,
          content_type: post.content_type,
          category_id: post.category_id,
          author_name: post.author_name,
          status: 'draft',
          is_featured: false,
          is_hero: false,
          tags: post.tags,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
        }),
      });
      if (!res.ok) throw new Error('Duplicate failed');
      toast.success('Post duplicated as draft');
      fetchPosts(activeTab || undefined);
    } catch (err) {
      toast.error('Failed to duplicate post');
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await adminConfirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Post deleted');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error('Failed to delete post');
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-mag-dark rounded-lg p-1 border border-mag-border w-fit">
        {CONTENT_TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.value
                ? 'bg-gold-400 text-mag-black'
                : 'text-mag-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-mag-dark border border-mag-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[1fr_120px_100px_120px_110px] gap-4 px-6 py-3 border-b border-mag-border text-xs font-medium text-mag-muted uppercase tracking-wider">
          <span>Title</span>
          <span>Type</span>
          <span>Status</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="divide-y divide-mag-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-md flex-shrink-0" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-16 ml-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Posts List */}
        {!loading && posts.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-mag-muted text-sm">No posts found.</p>
            <Link href="/admin/posts/new" className="mt-3 inline-block">
              <Button variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Create your first post
              </Button>
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="divide-y divide-mag-border">
            {posts.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_120px_110px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-mag-black/30 transition-colors"
              >
                {/* Title + Thumbnail */}
                <div className="flex items-center gap-3 min-w-0">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-mag-border flex-shrink-0" />
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-sm font-medium text-white hover:text-gold-400 truncate transition-colors"
                  >
                    {post.title || 'Untitled'}
                  </Link>
                </div>

                {/* Content Type */}
                <div>
                  <Badge variant="gold">{post.content_type}</Badge>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    variant={
                      post.status === 'published'
                        ? 'success'
                        : post.status === 'draft'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {post.status}
                  </Badge>
                </div>

                {/* Date */}
                <div className="text-xs text-mag-muted">
                  {formatDate(post.updated_at)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <button
                      className="p-2 text-mag-muted hover:text-white transition-colors rounded-md hover:bg-mag-border/30"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDuplicate(post)}
                    className="p-2 text-mag-muted hover:text-gold-400 transition-colors rounded-md hover:bg-gold-400/10"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-2 text-mag-muted hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
