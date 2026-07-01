import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/types/content";

export async function getPublishedVideos(limit = 12): Promise<Video[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Video[]) || [];
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();

  if (error) return null;
  return data as Video;
}

export async function getFeaturedVideo(): Promise<Video | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*, category:categories(*)")
    .eq("is_featured", true)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Video;
}
