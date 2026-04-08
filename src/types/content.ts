export type ContentType = "news" | "article" | "learn";
export type PostStatus = "draft" | "published" | "scheduled";
export type TweetLocation = "sidebar" | "inline" | "featured";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: unknown;
  body_html: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  content_type: ContentType;
  category_id: string | null;
  author_name: string;
  status: PostStatus;
  is_featured: boolean;
  is_hero: boolean;
  published_at: string | null;
  scheduled_for: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  youtube_id: string;
  thumbnail_url: string | null;
  duration: string | null;
  category_id: string | null;
  status: PostStatus;
  is_featured: boolean;
  published_at: string | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  icon_url: string | null;
  category: string | null;
  is_featured: boolean;
  status: PostStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface EmbeddedTweet {
  id: string;
  tweet_url: string;
  tweet_id: string;
  author_handle: string | null;
  caption: string | null;
  post_id: string | null;
  display_location: TweetLocation;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  storage_path: string;
  url: string;
  mime_type: string;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  definition: string;
  category: string | null;
  related_terms: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}
