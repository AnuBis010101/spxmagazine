import { createPublicClient } from "@/lib/supabase/public";
import type { Post } from "@/types/content";

export async function getPostsByAuthor(
  authorName: string,
  limit = 20
): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("author_name", authorName)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Post[]) || [];
}
