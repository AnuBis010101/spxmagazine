import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ posts: [], glossary: [] });
  }

  const supabase = await createClient();
  const pattern = `%${query}%`;

  // Search posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
    .order("published_at", { ascending: false })
    .limit(10);

  // Search glossary terms (wrapped in try/catch in case the table doesn't exist)
  let glossary = [];
  try {
    const { data: glossaryData } = await supabase
      .from("glossary_terms")
      .select("*")
      .or(`term.ilike.${pattern},definition.ilike.${pattern}`)
      .order("term", { ascending: true })
      .limit(5);

    glossary = glossaryData || [];
  } catch {
    // glossary_terms table may not exist yet
  }

  return NextResponse.json({
    posts: posts || [],
    glossary,
  });
}
