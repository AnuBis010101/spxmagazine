'use client';

import { useEffect, useState } from 'react';
import { Save, Megaphone, Link2, Star, Layout } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import type { Post, SiteSetting } from '@/types/content';

interface SocialLinks {
  twitter: string;
  telegram: string;
  website: string;
}

interface AnnouncementBar {
  active: boolean;
  text: string;
  link: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  // Hero post
  const [heroPostId, setHeroPostId] = useState('');
  const [savingHero, setSavingHero] = useState(false);

  // Featured posts
  const [featuredPostIds, setFeaturedPostIds] = useState<string[]>([
    '',
    '',
    '',
  ]);
  const [savingFeatured, setSavingFeatured] = useState(false);

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: '',
    telegram: '',
    website: '',
  });
  const [savingSocial, setSavingSocial] = useState(false);

  // Announcement bar
  const [announcement, setAnnouncement] = useState<AnnouncementBar>({
    active: false,
    text: '',
    link: '',
  });
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch published posts for dropdowns
      const { data: postsData } = await supabase
        .from('posts')
        .select('id, title, slug, status')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      setPosts((postsData as Post[]) || []);

      // Fetch all settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*');

      if (settings) {
        const settingsMap: Record<string, unknown> = {};
        (settings as SiteSetting[]).forEach((s) => {
          settingsMap[s.key] = s.value;
        });

        if (settingsMap.hero_post_id) {
          setHeroPostId(settingsMap.hero_post_id as string);
        }

        if (settingsMap.featured_post_ids) {
          const ids = settingsMap.featured_post_ids as string[];
          setFeaturedPostIds([
            ids[0] || '',
            ids[1] || '',
            ids[2] || '',
          ]);
        }

        if (settingsMap.social_links) {
          const links = settingsMap.social_links as SocialLinks;
          setSocialLinks({
            twitter: links.twitter || '',
            telegram: links.telegram || '',
            website: links.website || '',
          });
        }

        if (settingsMap.announcement_bar) {
          const bar = settingsMap.announcement_bar as AnnouncementBar;
          setAnnouncement({
            active: bar.active || false,
            text: bar.text || '',
            link: bar.link || '',
          });
        }
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const upsertSetting = async (key: string, value: unknown) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (error) throw error;
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      await upsertSetting('hero_post_id', heroPostId || null);
      toast.success('Hero post updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save hero post');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveFeatured = async () => {
    setSavingFeatured(true);
    try {
      const ids = featuredPostIds.filter((id) => id);
      await upsertSetting('featured_post_ids', ids);
      toast.success('Featured posts updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save featured posts');
    } finally {
      setSavingFeatured(false);
    }
  };

  const handleSaveSocial = async () => {
    setSavingSocial(true);
    try {
      await upsertSetting('social_links', {
        twitter: socialLinks.twitter.trim(),
        telegram: socialLinks.telegram.trim(),
        website: socialLinks.website.trim(),
      });
      toast.success('Social links updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save social links');
    } finally {
      setSavingSocial(false);
    }
  };

  const handleSaveAnnouncement = async () => {
    setSavingAnnouncement(true);
    try {
      await upsertSetting('announcement_bar', {
        active: announcement.active,
        text: announcement.text.trim(),
        link: announcement.link.trim(),
      });
      toast.success('Announcement bar updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save announcement');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const postOptions = [
    { value: '', label: 'None' },
    ...posts.map((p) => ({
      value: p.id,
      label: p.title || 'Untitled',
    })),
  ];

  const handleFeaturedChange = (index: number, value: string) => {
    setFeaturedPostIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        {/* Hero Post */}
        <div className="bg-mag-dark border border-mag-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-display font-bold text-white">
              Hero Post
            </h2>
          </div>
          <p className="text-sm text-mag-muted mb-4">
            Select which published post appears as the hero section on the
            homepage.
          </p>
          <Select
            label="Hero Post"
            value={heroPostId}
            onChange={(e) => setHeroPostId(e.target.value)}
            options={postOptions}
          />
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={handleSaveHero}
              isLoading={savingHero}
              disabled={savingHero}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Featured Posts */}
        <div className="bg-mag-dark border border-mag-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-display font-bold text-white">
              Featured Posts
            </h2>
          </div>
          <p className="text-sm text-mag-muted mb-4">
            Select up to 3 published posts for the featured grid on the
            homepage.
          </p>
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <Select
                key={index}
                label={`Featured Post ${index + 1}`}
                value={featuredPostIds[index]}
                onChange={(e) => handleFeaturedChange(index, e.target.value)}
                options={postOptions}
              />
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={handleSaveFeatured}
              isLoading={savingFeatured}
              disabled={savingFeatured}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-mag-dark border border-mag-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-display font-bold text-white">
              Social Links
            </h2>
          </div>
          <p className="text-sm text-mag-muted mb-4">
            Configure social media links displayed across the site.
          </p>
          <div className="space-y-3">
            <Input
              label="Twitter / X URL"
              value={socialLinks.twitter}
              onChange={(e) =>
                setSocialLinks((prev) => ({
                  ...prev,
                  twitter: e.target.value,
                }))
              }
              placeholder="https://x.com/..."
            />
            <Input
              label="Telegram URL"
              value={socialLinks.telegram}
              onChange={(e) =>
                setSocialLinks((prev) => ({
                  ...prev,
                  telegram: e.target.value,
                }))
              }
              placeholder="https://t.me/..."
            />
            <Input
              label="Website URL"
              value={socialLinks.website}
              onChange={(e) =>
                setSocialLinks((prev) => ({
                  ...prev,
                  website: e.target.value,
                }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={handleSaveSocial}
              isLoading={savingSocial}
              disabled={savingSocial}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-mag-dark border border-mag-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-display font-bold text-white">
              Announcement Bar
            </h2>
          </div>
          <p className="text-sm text-mag-muted mb-4">
            Display an announcement bar at the top of the site.
          </p>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={announcement.active}
                onChange={(e) =>
                  setAnnouncement((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-mag-border bg-mag-dark text-gold-400 focus:ring-gold-400/50 accent-[#d4a843]"
              />
              <span className="text-sm text-mag-light">
                Show announcement bar
              </span>
            </label>
            <Input
              label="Announcement Text"
              value={announcement.text}
              onChange={(e) =>
                setAnnouncement((prev) => ({
                  ...prev,
                  text: e.target.value,
                }))
              }
              placeholder="Important announcement..."
            />
            <Input
              label="Link (optional)"
              value={announcement.link}
              onChange={(e) =>
                setAnnouncement((prev) => ({
                  ...prev,
                  link: e.target.value,
                }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={handleSaveAnnouncement}
              isLoading={savingAnnouncement}
              disabled={savingAnnouncement}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
