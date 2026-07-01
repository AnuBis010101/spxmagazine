import { createPublicClient } from "@/lib/supabase/public";
import type { EmbeddedTweet } from "@/types/content";

export async function getSidebarTweets(limit = 5): Promise<EmbeddedTweet[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("embedded_tweets")
    .select("*")
    .eq("is_active", true)
    .eq("display_location", "sidebar")
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data as EmbeddedTweet[]) || [];
}

export async function getFeaturedTweets(limit = 3): Promise<EmbeddedTweet[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("embedded_tweets")
    .select("*")
    .eq("is_active", true)
    .eq("display_location", "featured")
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) return [];
  return (data as EmbeddedTweet[]) || [];
}
