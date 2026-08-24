import { createPublicClient } from "@/lib/supabase/public";
import type { Post, ContentType } from "@/types/content";
import { POSTS_PER_PAGE, MAGAZINE_TAG } from "@/lib/constants";

export async function getPublishedPosts(
  contentType?: ContentType,
  page = 1,
  limit = POSTS_PER_PAGE,
  tag?: string,
  excludeTag?: string,
  /**
   * Optional publish-date window, as ISO strings. `since` is inclusive and
   * `before` exclusive, so a pair of calls sharing one cutoff partitions the
   * posts cleanly with no duplicates and nothing dropped.
   */
  window?: { since?: string; before?: string }
): Promise<{ posts: Post[]; total: number }> {
  const supabase = createPublicClient();
  const offset = (page - 1) * limit;

  const now = new Date().toISOString();
  let query = supabase
    .from("posts")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("status", "published")
    .lte("published_at", now)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (window?.since) {
    query = query.gte("published_at", window.since);
  }
  if (window?.before) {
    query = query.lt("published_at", window.before);
  }

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

/**
 * Posts split into a recent lead section and everything older, so a listing
 * ages its own content out without anyone unpublishing anything. Used by both
 * News and Community Articles.
 *
 * The cutoff is computed once here and shared by both queries: two separate
 * `Date.now()` calls could straddle a post published in the intervening
 * moment and either duplicate it or lose it. Keeping the clock read in the
 * data layer also leaves the page components pure.
 *
 * `fresh` is always the first page of the window — the lead section belongs to
 * page 1, and callers drop it on deeper pages. `earlier` is what paginates.
 */
export async function getPostsSplitByFreshness(
  contentType: ContentType,
  freshDays: number,
  page = 1,
  limit = POSTS_PER_PAGE,
  tag?: string,
  excludeTag?: string
): Promise<{ fresh: Post[]; earlier: Post[]; earlierTotal: number }> {
  const cutoff = new Date(Date.now() - freshDays * 24 * 60 * 60 * 1000).toISOString();

  const [freshRes, earlierRes] = await Promise.all([
    getPublishedPosts(contentType, 1, limit, tag, excludeTag, { since: cutoff }),
    getPublishedPosts(contentType, page, limit, tag, excludeTag, { before: cutoff }),
  ]);

  return {
    fresh: freshRes.posts,
    earlier: earlierRes.posts,
    earlierTotal: earlierRes.total,
  };
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

// Latest community articles — 'article' posts WITHOUT the magazine tag.
// Feeds the home "Articles" tab.
export async function getLatestCommunityArticles(limit = 3): Promise<Post[]> {
  const { posts } = await getPublishedPosts(
    "article",
    1,
    limit,
    undefined,
    MAGAZINE_TAG
  );
  return posts;
}

/** Fields a free-text term is matched against, in the OR group for that term. */
const SEARCH_TEXT_FIELDS = ["title", "excerpt", "author_name"] as const;

/** More terms than this and the query is noise; also bounds the URL length. */
const MAX_SEARCH_TERMS = 6;

/**
 * Escape LIKE wildcards so user input is matched literally.
 *
 * Without this a lone "%" matches every row, because it is passed straight
 * through to ILIKE as "match anything". Backslash goes first, or it would
 * double-escape the escapes added after it.
 */
function escapeLike(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/[%_]/g, (m) => `\\${m}`);
}

/** Remove the characters that would break PostgREST's or() filter grammar. */
function stripFilterGrammar(value: string): string {
  return value.replace(/[,()]/g, " ").trim();
}

/**
 * Free-text search across posts.
 *
 * Matches each term against title, excerpt AND author_name, plus tags — an
 * author's name previously returned nothing, because only title and excerpt
 * were searched.
 *
 * Multi-word queries are ANDed term by term rather than matched as one
 * literal string, so "weekly cognisphere" finds the same posts as
 * "cognisphere weekly". Chained .or() calls AND their groups together, which
 * is what gives "all terms must appear, each in some field".
 */
export async function searchPosts(query: string, limit = 20): Promise<Post[]> {
  const raw = query.trim();
  if (!raw) return [];

  const terms = raw
    .split(/\s+/)
    .map((t) => stripFilterGrammar(escapeLike(t)))
    .filter(Boolean)
    .slice(0, MAX_SEARCH_TERMS);
  if (!terms.length) return [];

  const supabase = createPublicClient();
  const now = new Date().toISOString();

  let textQuery = supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .lte("published_at", now);

  // One OR group per term; chaining ANDs the groups.
  for (const term of terms) {
    textQuery = textQuery.or(
      SEARCH_TEXT_FIELDS.map((f) => `${f}.ilike.%${term}%`).join(","),
    );
  }

  // Tags are an array column, so they cannot join the ilike OR group above.
  // `contains` (not `overlaps`) keeps the AND semantics — with overlaps, a
  // two-word query would match posts carrying only one of the words as a tag
  // and quietly re-broaden the search.
  const tagTerms = raw
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9-]/g, ""))
    .filter(Boolean)
    .slice(0, MAX_SEARCH_TERMS);

  const [textResult, tagResult] = await Promise.all([
    textQuery.order("published_at", { ascending: false }).limit(limit),
    tagTerms.length
      ? supabase
          .from("posts")
          .select("*, category:categories(*)")
          .eq("status", "published")
          .lte("published_at", now)
          .contains("tags", tagTerms)
          .order("published_at", { ascending: false })
          .limit(limit)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (textResult.error && tagResult.error) return [];

  const merged = [
    ...((textResult.data as Post[]) || []),
    ...((tagResult.data as Post[]) || []),
  ];

  // Dedupe by id — a post matching both passes must appear once.
  const seen = new Set<string>();
  const unique = merged.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  unique.sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));
  return unique.slice(0, limit);
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
