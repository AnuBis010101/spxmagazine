import { createPublicClient } from "@/lib/supabase/public";
import type { Post, ContentType } from "@/types/content";
import { POSTS_PER_PAGE } from "@/lib/constants";

export async function getPublishedPosts(
  contentType?: ContentType,
  page = 1,
  limit = POSTS_PER_PAGE,
  tag?: string,
  excludeTag?: string
): Promise<{ posts: Post[]; total: number }> {
  const supabase = createPublicClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from("posts")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (contentType) {
    query = query.eq("content_type", contentType);
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  if (excludeTag) {
    query = query.not("tags", "cs", `{${excludeTag}}`);
  }

  const { data, count, error } = await query;
  if (error) return { posts: [], total: 0 };

  return { posts: (data as Post[]) || [], total: count || 0 };
}

export async function getAllTags(
  contentType?: ContentType,
  excludeTag?: string
): Promise<string[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("posts")
    .select("tags")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  if (contentType) query = query.eq("content_type", contentType);
  if (excludeTag) query = query.not("tags", "cs", `{${excludeTag}}`);

  const { data, error } = await query;
  if (error || !data) return [];

  const tagSet = new Set<string>();
  for (const row of data) {
    if (Array.isArray(row.tags)) {
      for (const t of row.tags) tagSet.add(t);
    }
  }
  // Never surface the magazine/community discriminator tag as a filter chip.
  if (excludeTag) tagSet.delete(excludeTag);
  return Array.from(tagSet).sort();
}

export async function getPostBySlug(
  slug: string,
  contentType?: ContentType
): Promise<Post | null> {
  const supabase = createPublicClient();
  let query = supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  // Constrain to the route's content type so the same slug can't resolve at
  // /news, /articles AND /learn (duplicate content).
  if (contentType) query = query.eq("content_type", contentType);

  const { data, error } = await query.single();

  if (error) return null;
  return data as Post;
}

export async function getHeroPost(): Promise<Post | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("is_hero", true)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Post;
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("is_featured", true)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Post[]) || [];
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Post[]) || [];
}

export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3,
  tags?: string[]
): Promise<Post[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .neq("id", postId)
    .order("published_at", { ascending: false })
    .limit(limit);

  // Prefer same-category; otherwise fall back to shared tags so uncategorized
  // posts don't just surface arbitrary recent articles.
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  } else if (tags && tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data as Post[]) || [];
}

export async function getLatestByContentType(
  contentType: ContentType,
  limit = 4
): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("content_type", contentType)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Post[]) || [];
}

export async function searchPosts(query: string): Promise<Post[]> {
  // Strip characters that would break PostgREST's or() filter grammar.
  const safe = query.replace(/[,()]/g, " ").trim();
  if (!safe) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%`)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) return [];
  return (data as Post[]) || [];
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data as Post[]) || [];
}

export async function getPostsBySlugs(slugs: string[]): Promise<Post[]> {
  if (slugs.length === 0) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .in("slug", slugs);
  if (error) return [];
  return (data as Post[]) || [];
}
