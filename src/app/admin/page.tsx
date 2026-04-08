import Link from 'next/link';
import {
  FileText,
  FilePenLine,
  Video,
  Users,
  Plus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format-date';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts in parallel
  const [publishedRes, draftsRes, videosRes, subscribersRes, recentPostsRes] =
    await Promise.all([
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),
      supabase
        .from('videos')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('posts')
        .select('id, title, content_type, status, published_at, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  const publishedCount = publishedRes.count ?? 0;
  const draftsCount = draftsRes.count ?? 0;
  const videosCount = videosRes.count ?? 0;
  const subscribersCount = subscribersRes.count ?? 0;
  const recentPosts = recentPostsRes.data ?? [];

  const stats = [
    {
      label: 'Published Posts',
      count: publishedCount,
      icon: FileText,
    },
    {
      label: 'Drafts',
      count: draftsCount,
      icon: FilePenLine,
    },
    {
      label: 'Videos',
      count: videosCount,
      icon: Video,
    },
    {
      label: 'Subscribers',
      count: subscribersCount,
      icon: Users,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-6">
        Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-mag-dark border border-mag-border rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-gold-400" />
              </div>
              <p className="text-3xl font-bold font-display text-white">
                {stat.count}
              </p>
              <p className="text-sm text-mag-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent posts */}
      <div className="bg-mag-dark border border-mag-border rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-mag-border">
          <h2 className="text-lg font-display font-bold text-white">
            Recent Posts
          </h2>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold bg-gold-400 text-mag-black rounded-lg hover:bg-gold-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="p-6 text-center text-mag-muted">
            No posts yet. Create your first post to get started.
          </div>
        ) : (
          <div className="divide-y divide-mag-border">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium text-white truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-mag-muted mt-1">
                    {formatDate(post.published_at || post.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="gold">{post.content_type}</Badge>
                  <Badge
                    variant={post.status === 'published' ? 'success' : 'warning'}
                  >
                    {post.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
