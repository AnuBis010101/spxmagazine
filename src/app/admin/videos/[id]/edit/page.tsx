'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { slugify } from '@/lib/utils/slugify';
import toast from 'react-hot-toast';
import type { Video } from '@/types/content';

function extractYouTubeId(input: string): string {
  if (!input) return '';
  if (/^[\w-]{11}$/.test(input.trim())) return input.trim();
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`);
    if (url.searchParams.has('v')) return url.searchParams.get('v') || '';
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0];
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && (parts[0] === 'embed' || parts[0] === 'shorts')) {
      return parts[1];
    }
  } catch {
    // Not a valid URL
  }
  return input.trim();
}

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await fetch(`/api/admin/videos?id=${id}`);
      if (!res.ok) {
        toast.error('Video not found');
        router.push('/admin/videos');
        return;
      }
      const { video } = await res.json();
      if (!video) {
        toast.error('Video not found');
        router.push('/admin/videos');
        return;
      }
      const v = video as Video;
      setTitle(v.title);
      setSlug(v.slug);
      setYoutubeInput(v.youtube_id);
      setYoutubeId(v.youtube_id);
      setDescription(v.description || '');
      setDuration(v.duration || '');
      setStatus(v.status);
      setIsFeatured(v.is_featured);
      setTags(v.tags || []);
      setLoading(false);
    };
    fetchVideo();
  }, [id]);

  const handleYoutubeChange = (value: string) => {
    setYoutubeInput(value);
    setYoutubeId(extractYouTubeId(value));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (saveStatus: string) => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!youtubeId) {
      toast.error('YouTube URL or ID is required');
      return;
    }

    setSaving(true);

    const videoData = {
      title: title.trim(),
      slug: slug.trim(),
      youtube_id: youtubeId,
      thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      description: description.trim() || null,
      duration: duration.trim() || null,
      status: saveStatus,
      is_featured: isFeatured,
      tags,
      updated_at: new Date().toISOString(),
      published_at:
        saveStatus === 'published'
          ? new Date().toISOString()
          : null,
    };

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...videoData }),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Update failed');
      }
      toast.success('Video updated');
      router.push('/admin/videos');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to update video');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Failed to delete video');
    } else {
      toast.success('Video deleted');
      router.push('/admin/videos');
    }
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/videos"
          className="inline-flex items-center gap-1.5 text-sm text-mag-muted hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Videos
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">
          Edit: {title}
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title..."
              className="w-full bg-transparent border-b border-mag-border focus:border-gold-400 text-2xl font-display text-white placeholder:text-mag-muted outline-none pb-3 transition-colors"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-mag-muted">/videos/</span>
              {slugEditable ? (
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  onBlur={() => setSlugEditable(false)}
                  className="text-sm text-mag-muted bg-transparent border-b border-mag-border focus:border-gold-400 outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setSlugEditable(true)}
                  className="text-sm text-mag-muted hover:text-gold-400 transition-colors"
                  title="Click to edit slug"
                >
                  {slug}
                </button>
              )}
            </div>
          </div>

          {/* YouTube URL */}
          <div>
            <Input
              label="YouTube URL or Video ID"
              value={youtubeInput}
              onChange={(e) => handleYoutubeChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            {youtubeId && (
              <p className="text-xs text-mag-muted mt-1">
                ID: <span className="text-gold-400">{youtubeId}</span>
              </p>
            )}
          </div>

          {/* Thumbnail Preview */}
          {youtubeId && (
            <div className="bg-mag-dark border border-mag-border rounded-xl p-4">
              <label className="block text-sm font-medium text-mag-light mb-2">
                Thumbnail Preview
              </label>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-mag-border">
                <Image
                  src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-mag-light mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Video description..."
              rows={5}
              className="w-full bg-mag-dark border border-mag-border rounded-lg p-3 text-white placeholder:text-mag-muted focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 outline-none transition-colors resize-none text-sm"
            />
          </div>

          {/* Duration */}
          <Input
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="12:34"
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Status & Save */}
            <div className="bg-mag-dark border border-mag-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-white">Publish</h3>

              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
              />

              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSave('draft')}
                  isLoading={saving}
                  disabled={saving}
                >
                  Save Draft
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSave('published')}
                  isLoading={saving}
                  disabled={saving}
                >
                  Publish
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-mag-dark border border-mag-border rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-medium text-white">Tags</h3>
              <Input
                placeholder="Type a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-mag-border/50 text-mag-light rounded-full text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Toggle */}
            <div className="bg-mag-dark border border-mag-border rounded-xl p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-mag-border bg-mag-dark text-gold-400 focus:ring-gold-400/50 accent-[#d4a843]"
                />
                <span className="text-sm text-mag-light">Featured Video</span>
              </label>
            </div>

            {/* Delete */}
            <div className="bg-mag-dark border border-mag-border rounded-xl p-5">
              <Button
                variant="secondary"
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleDelete}
              >
                Delete Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
