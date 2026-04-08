import { createClient } from "@/lib/supabase/server";
import type {
  Post,
  Video,
  EmbeddedTweet,
  Category,
  MediaItem,
} from "@/types/content";

export async function getAllPosts(contentType?: string): Promise<Post[]> {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("*, category:categories(*)")
    .order("updated_at", { ascending: false });

  if (contentType) {
    query = query.eq("content_type", contentType);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data as Post[]) || [];
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Post;
}

export async function getAllVideos(): Promise<Video[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, category:categories(*)")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as Video[]) || [];
}

export async function getVideoById(id: string): Promise<Video | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Video;
}

export async function getAllTweets(): Promise<EmbeddedTweet[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("embedded_tweets")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as EmbeddedTweet[]) || [];
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as Category[]) || [];
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as MediaItem[]) || [];
}

export async function getStats(): Promise<{
  publishedPosts: number;
  draftPosts: number;
  totalVideos: number;
  totalSubscribers: number;
}> {
  const supabase = await createClient();

  const [publishedRes, draftRes, videosRes, subscribersRes] = await Promise.all(
    [
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("videos")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("subscribers")
        .select("*", { count: "exact", head: true }),
    ]
  );

  return {
    publishedPosts: publishedRes.count || 0,
    draftPosts: draftRes.count || 0,
    totalVideos: videosRes.count || 0,
    totalSubscribers: subscribersRes.count || 0,
  };
}

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Post[]) || [];
}
