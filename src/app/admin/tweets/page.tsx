'use client';
import { adminConfirm } from '@/components/admin/ConfirmProvider';

import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  GripVertical,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils/format-date';
import toast from 'react-hot-toast';
import type { EmbeddedTweet, TweetLocation } from '@/types/content';

function extractTweetId(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(
      url.includes('://') ? url : `https://${url}`
    );
    // Match x.com/user/status/123 or twitter.com/user/status/123
    const parts = parsed.pathname.split('/').filter(Boolean);
    const statusIdx = parts.indexOf('status');
    if (statusIdx >= 0 && parts[statusIdx + 1]) {
      return parts[statusIdx + 1].split('?')[0];
    }
  } catch {
    // not a valid URL
  }
  return '';
}

const LOCATION_OPTIONS = [
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'inline', label: 'Inline' },
  { value: 'featured', label: 'Featured' },
];

export default function AdminTweetsPage() {
  const [tweets, setTweets] = useState<EmbeddedTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Add form state
  const [tweetUrl, setTweetUrl] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  const [caption, setCaption] = useState('');
  const [displayLocation, setDisplayLocation] =
    useState<TweetLocation>('sidebar');

  const supabase = createClient();

  const fetchTweets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('embedded_tweets')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error('Failed to load tweets');
      console.error(error);
    } else {
      setTweets((data as EmbeddedTweet[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleTweetUrlChange = (value: string) => {
    setTweetUrl(value);
    setTweetId(extractTweetId(value));
  };

  const resetForm = () => {
    setTweetUrl('');
    setTweetId('');
    setAuthorHandle('');
    setCaption('');
    setDisplayLocation('sidebar');
  };

  const handleAddTweet = async () => {
    if (!tweetUrl.trim()) {
      toast.error('Tweet URL is required');
      return;
    }
    if (!tweetId) {
      toast.error('Could not extract tweet ID from URL');
      return;
    }

    setSaving(true);

    const tweetData = {
      tweet_url: tweetUrl.trim(),
      tweet_id: tweetId,
      author_handle: authorHandle.trim().replace(/^@/, '') || null,
      caption: caption.trim() || null,
      display_location: displayLocation,
      sort_order: tweets.length,
      is_active: true,
    };

    try {
      const res = await fetch('/api/admin/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tweetData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add tweet');
      toast.success('Tweet added');
      setTweets((prev) => [...prev, json.data as EmbeddedTweet]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add tweet');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const res = await fetch('/api/admin/tweets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !currentActive }),
    });

    if (!res.ok) {
      toast.error('Failed to update tweet');
      console.error(await res.text());
    } else {
      setTweets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_active: !currentActive } : t
        )
      );
      toast.success(currentActive ? 'Tweet deactivated' : 'Tweet activated');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await adminConfirm(
      'Are you sure you want to delete this tweet embed?'
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/tweets?id=${id}`, { method: 'DELETE' });

    if (!res.ok) {
      toast.error('Failed to delete tweet');
      console.error(await res.text());
    } else {
      toast.success('Tweet deleted');
      setTweets((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSortOrderChange = async (id: string, newOrder: number) => {
    const res = await fetch('/api/admin/tweets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, sort_order: newOrder }),
    });

    if (!res.ok) {
      toast.error('Failed to update order');
      console.error(await res.text());
    } else {
      setTweets((prev) =>
        prev
          .map((t) => (t.id === id ? { ...t, sort_order: newOrder } : t))
          .sort((a, b) => a.sort_order - b.sort_order)
      );
    }
  };

  const locationBadgeVariant = (loc: TweetLocation) => {
    switch (loc) {
      case 'featured':
        return 'gold' as const;
      case 'sidebar':
        return 'default' as const;
      case 'inline':
        return 'success' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-white">
          Embedded Tweets
        </h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tweet
        </Button>
      </div>

      {/* Tweets Table */}
      <div className="bg-mag-dark border border-mag-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-[40px_1fr_100px_100px_60px_60px_60px] gap-4 px-6 py-3 border-b border-mag-border text-xs font-medium text-mag-muted uppercase tracking-wider">
          <span>Order</span>
          <span>Tweet</span>
          <span>Location</span>
          <span>Date</span>
          <span>Active</span>
          <span />
          <span />
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="divide-y divide-mag-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="w-6 h-6 rounded flex-shrink-0" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-5 w-16 ml-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tweets.length === 0 && (
          <div className="px-6 py-16 text-center">
            <MessageSquare className="w-10 h-10 text-mag-muted mx-auto mb-3" />
            <p className="text-mag-muted text-sm">No embedded tweets yet.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add your first tweet
            </Button>
          </div>
        )}

        {/* Tweets List */}
        {!loading && tweets.length > 0 && (
          <div className="divide-y divide-mag-border">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="grid grid-cols-1 md:grid-cols-[40px_1fr_100px_100px_60px_60px_60px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-mag-black/30 transition-colors"
              >
                {/* Sort Order */}
                <div className="flex items-center gap-1">
                  <GripVertical className="w-4 h-4 text-mag-muted hidden md:block" />
                  <input
                    type="number"
                    value={tweet.sort_order}
                    onChange={(e) =>
                      handleSortOrderChange(
                        tweet.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-10 h-7 text-center text-xs bg-mag-black border border-mag-border rounded text-white"
                  />
                </div>

                {/* Tweet Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {tweet.author_handle && (
                      <span className="text-sm font-medium text-gold-400">
                        @{tweet.author_handle}
                      </span>
                    )}
                    <a
                      href={tweet.tweet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-mag-muted hover:text-white transition-colors truncate inline-flex items-center gap-1"
                    >
                      {tweet.tweet_url}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                  {tweet.caption && (
                    <p className="text-xs text-mag-muted mt-0.5 truncate">
                      {tweet.caption}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <Badge variant={locationBadgeVariant(tweet.display_location)}>
                    {tweet.display_location}
                  </Badge>
                </div>

                {/* Date */}
                <div className="text-xs text-mag-muted">
                  {formatDate(tweet.created_at)}
                </div>

                {/* Active Toggle */}
                <div>
                  <button
                    onClick={() =>
                      handleToggleActive(tweet.id, tweet.is_active)
                    }
                    className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                      tweet.is_active ? 'bg-gold-400' : 'bg-mag-border'
                    }`}
                    title={tweet.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        tweet.is_active ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Spacer */}
                <div />

                {/* Delete */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(tweet.id)}
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

      {/* Add Tweet Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add Embedded Tweet"
      >
        <div className="space-y-4">
          <div>
            <Input
              label="Tweet URL"
              value={tweetUrl}
              onChange={(e) => handleTweetUrlChange(e.target.value)}
              placeholder="https://x.com/user/status/123456789"
            />
            {tweetId && (
              <p className="text-xs text-mag-muted mt-1">
                Tweet ID: <span className="text-gold-400">{tweetId}</span>
              </p>
            )}
          </div>

          <Input
            label="Author Handle (optional)"
            value={authorHandle}
            onChange={(e) => setAuthorHandle(e.target.value)}
            placeholder="@handle"
          />

          <Input
            label="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption for context"
          />

          <Select
            label="Display Location"
            value={displayLocation}
            onChange={(e) =>
              setDisplayLocation(e.target.value as TweetLocation)
            }
            options={LOCATION_OPTIONS}
          />

          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddTweet}
              isLoading={saving}
              disabled={saving}
            >
              Add Tweet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
