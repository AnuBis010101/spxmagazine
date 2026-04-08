-- SPX Magazine Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#D4AF37',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Posts (news, articles, learn content)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body JSONB,
  body_html TEXT,
  cover_image TEXT,
  cover_image_alt TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('news', 'article', 'learn')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'SPX Magazine',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  is_featured BOOLEAN DEFAULT false,
  is_hero BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_content_type ON posts(content_type, status, published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_featured ON posts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_posts_hero ON posts(is_hero) WHERE is_hero = true;
CREATE INDEX idx_posts_published ON posts(published_at DESC) WHERE status = 'published';

-- Videos
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tools
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Embedded Tweets
CREATE TABLE embedded_tweets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tweet_url TEXT NOT NULL,
  tweet_id TEXT NOT NULL,
  author_handle TEXT,
  caption TEXT,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  display_location TEXT DEFAULT 'sidebar' CHECK (display_location IN ('sidebar', 'inline', 'featured')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Media Library
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_post_id', '{"post_id": null}'),
  ('featured_post_ids', '{"ids": []}'),
  ('social_links', '{"twitter": "", "telegram": "", "website": ""}'),
  ('announcement_bar', '{"text": "", "link": "", "active": false}');

-- Seed default categories
INSERT INTO categories (name, slug, color, sort_order) VALUES
  ('News', 'news', '#D4AF37', 1),
  ('Community', 'community', '#D4AF37', 2),
  ('Education', 'education', '#D4AF37', 3),
  ('Culture', 'culture', '#D4AF37', 4),
  ('Technology', 'technology', '#D4AF37', 5);

-- Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE embedded_tweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read published posts" ON posts
  FOR SELECT USING (status = 'published' AND published_at <= now());

CREATE POLICY "Public read published videos" ON videos
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read published tools" ON tools
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public read active tweets" ON embedded_tweets
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read settings" ON site_settings
  FOR SELECT USING (true);

-- Admin full access policies (authenticated users)
CREATE POLICY "Admin full access posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access videos" ON videos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access tools" ON tools
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access tweets" ON embedded_tweets
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access media" ON media
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin read subscribers" ON subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Anyone can subscribe
CREATE POLICY "Public insert subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Create storage buckets (run these separately in Supabase Dashboard > Storage)
-- 1. Create bucket named "images" with public access
-- 2. Create bucket named "icons" with public access
