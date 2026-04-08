'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Play } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils/format-date';
import toast from 'react-hot-toast';
import type { Video } from '@/types/content';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error('Failed to load videos');
      console.error(error);
    } else {
      setVideos((data as Video[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const { error } = await supabase.from('videos').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete video');
      console.error(error);
    } else {
      toast.success('Video deleted');
      setVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Videos</h1>
        <Link href="/admin/videos/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </Link>
      </div>

      {/* Videos Table */}
      <div className="bg-mag-dark border border-mag-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[1fr_100px_120px_80px] gap-4 px-6 py-3 border-b border-mag-border text-xs font-medium text-mag-muted uppercase tracking-wider">
          <span>Video</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="divide-y divide-mag-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="w-24 h-14 rounded-md flex-shrink-0" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-16 ml-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="px-6 py-16 text-center">
            <Play className="w-10 h-10 text-mag-muted mx-auto mb-3" />
            <p className="text-mag-muted text-sm">No videos found.</p>
            <Link href="/admin/videos/new" className="mt-3 inline-block">
              <Button variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add your first video
              </Button>
            </Link>
          </div>
        )}

        {/* Videos List */}
        {!loading && videos.length > 0 && (
          <div className="divide-y divide-mag-border">
            {videos.map((video) => (
              <div
                key={video.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_100px_120px_80px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-mag-black/30 transition-colors"
              >
                {/* Thumbnail + Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-24 h-14 rounded-md overflow-hidden flex-shrink-0 bg-mag-border">
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/videos/${video.id}/edit`}
                      className="text-sm font-medium text-white hover:text-gold-400 truncate block transition-colors"
                    >
                      {video.title || 'Untitled'}
                    </Link>
                    {video.duration && (
                      <span className="text-xs text-mag-muted">
                        {video.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    variant={
                      video.status === 'published'
                        ? 'success'
                        : video.status === 'draft'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {video.status}
                  </Badge>
                </div>

                {/* Date */}
                <div className="text-xs text-mag-muted">
                  {formatDate(video.updated_at)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/videos/${video.id}/edit`}>
                    <button
                      className="p-2 text-mag-muted hover:text-white transition-colors rounded-md hover:bg-mag-border/30"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
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
