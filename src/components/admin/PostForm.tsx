'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { slugify } from '@/lib/utils/slugify';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });
import type { Post, Category, ContentType, PostStatus } from '@/types/content';

interface PostFormProps {
  post?: Post;
  categories: Category[];
}

export default function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [slugEditable, setSlugEditable] = useState(false);

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [bodyHtml, setBodyHtml] = useState(post?.body_html || '');
  const [contentType, setContentType] = useState<ContentType>(
    post?.content_type || 'news'
  );
  const [status, setStatus] = useState<PostStatus>(post?.status || 'draft');
  const [scheduledFor, setScheduledFor] = useState(post?.scheduled_for || '');
  const [categoryId, setCategoryId] = useState(post?.category_id || '');
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [coverImageAlt, setCoverImageAlt] = useState(
    post?.cover_image_alt || ''
  );
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [authorName, setAuthorName] = useState(
    post?.author_name || 'SPX Magazine'
  );
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false);
  const [isHero, setIsHero] = useState(post?.is_hero || false);
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(
    post?.meta_description || ''
  );
  const [seoOpen, setSeoOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post && !slugEditable) {
      setSlug(slugify(value));
    }
  };

  // Tag management
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

  // Image upload via dropzone — uses server route to bypass Storage RLS
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'posts');

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();

      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Upload failed');
      }

      setCoverImage(json.url);
      toast.success('Image uploaded');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Image upload failed';
      toast.error(message);
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 1,
    multiple: false,
  });

  // Save handler
  const handleSave = async (saveStatus?: PostStatus) => {
    const finalStatus = saveStatus || status;

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    setSaving(true);

    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      body_html: bodyHtml || null,
      cover_image: coverImage || null,
      cover_image_alt: coverImageAlt.trim() || null,
      content_type: contentType,
      category_id: categoryId || null,
      author_name: authorName.trim() || 'SPX Magazine',
      status: finalStatus,
      is_featured: isFeatured,
      is_hero: isHero,
      scheduled_for:
        finalStatus === 'scheduled' && scheduledFor ? scheduledFor : null,
      published_at:
        finalStatus === 'published'
          ? post?.published_at || new Date().toISOString()
          : post?.published_at || null,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      tags,
      updated_at: new Date().toISOString(),
    };

    try {
      if (post) {
        // Use server-side admin API to bypass RLS
        const res = await fetch('/api/admin/posts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: post.id, ...postData }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Update failed');
        toast.success('Post updated');
      } else {
        const res = await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Create failed');
        toast.success('Post created');
      }

      // Revalidate cached pages
      try {
        await fetch(
          `/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATION_SECRET || ''}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: '/' }),
          }
        );
      } catch {
        // Revalidation failure is non-critical
      }

      router.push('/admin/posts');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  // Category options
  const categoryOptions = [
    { value: '', label: 'No category' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const contentTypeOptions = [
    { value: 'news', label: 'News' },
    { value: 'article', label: 'Article' },
    { value: 'learn', label: 'Learn' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title..."
            className="w-full bg-transparent border-b border-mag-border focus:border-gold-400 text-2xl font-display text-white placeholder:text-mag-muted outline-none pb-3 transition-colors"
          />
          {/* Slug */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-mag-muted">/</span>
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
                {slug || 'auto-generated-slug'}
              </button>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-mag-light mb-1.5">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value.slice(0, 200))}
            placeholder="Brief summary..."
            rows={3}
            className="w-full bg-mag-dark border border-mag-border rounded-lg p-3 text-white placeholder:text-mag-muted focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 outline-none transition-colors resize-none text-sm"
          />
          <p className="text-xs text-mag-muted mt-1 text-right">
            {excerpt.length}/200
          </p>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-mag-light mb-1.5">
            Content
          </label>
          <RichTextEditor content={bodyHtml} onChange={setBodyHtml} />
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="lg:col-span-1 mt-8 lg:mt-0">
        <div className="lg:sticky lg:top-6 space-y-6">
          {/* Status & Publish */}
          <div className="bg-mag-dark border border-mag-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-white">Publish</h3>

            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              options={statusOptions}
            />

            {status === 'scheduled' && (
              <Input
                label="Schedule for"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            )}

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

          {/* Content Type */}
          <div className="bg-mag-dark border border-mag-border rounded-xl p-5">
            <Select
              label="Content Type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              options={contentTypeOptions}
            />
          </div>

          {/* Category */}
          <div className="bg-mag-dark border border-mag-border rounded-xl p-5">
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categoryOptions}
            />
          </div>

          {/* Cover Image */}
          <div className="bg-mag-dark border border-mag-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-white">Cover Image</h3>

            {coverImage ? (
              <div className="relative group">
                <Image
                  src={coverImage}
                  alt={coverImageAlt || 'Cover'}
                  width={400}
                  height={225}
                  className="w-full rounded-lg object-cover aspect-video"
                />
                <button
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-gold-400 bg-gold-400/5'
                    : 'border-mag-border hover:border-mag-muted'
                }`}
              >
                <input {...getInputProps()} />
                {uploadingImage ? (
                  <p className="text-sm text-mag-muted">Uploading...</p>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-mag-muted mx-auto mb-2" />
                    <p className="text-sm text-mag-muted">
                      Drop an image or click to upload
                    </p>
                  </>
                )}
              </div>
            )}

            {coverImage && (
              <Input
                placeholder="Alt text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
              />
            )}
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

          {/* Author */}
          <div className="bg-mag-dark border border-mag-border rounded-xl p-5">
            <Input
              label="Author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>

          {/* SEO Section */}
          <div className="bg-mag-dark border border-mag-border rounded-xl overflow-hidden">
            <button
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between p-5 text-sm font-medium text-white hover:bg-mag-border/20 transition-colors"
            >
              SEO Settings
              {seoOpen ? (
                <ChevronUp className="w-4 h-4 text-mag-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-mag-muted" />
              )}
            </button>
            {seoOpen && (
              <div className="px-5 pb-5 space-y-4">
                <Input
                  label="Meta Title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || 'Page title'}
                />
                <div>
                  <label className="block text-sm font-medium text-mag-light mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Search engine description..."
                    rows={3}
                    className="w-full bg-mag-dark border border-mag-border rounded-lg p-3 text-white placeholder:text-mag-muted focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 outline-none transition-colors resize-none text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="bg-mag-dark border border-mag-border rounded-xl p-5 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-mag-border bg-mag-dark text-gold-400 focus:ring-gold-400/50 accent-[#d4a843]"
              />
              <span className="text-sm text-mag-light">Featured Post</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isHero}
                onChange={(e) => setIsHero(e.target.checked)}
                className="w-4 h-4 rounded border-mag-border bg-mag-dark text-gold-400 focus:ring-gold-400/50 accent-[#d4a843]"
              />
              <span className="text-sm text-mag-light">Hero Post</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
