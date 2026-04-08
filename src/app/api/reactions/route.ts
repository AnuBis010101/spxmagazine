import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_REACTIONS = new Set(["fire", "mindblown", "clap", "rocket"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, reaction } = body as { slug?: string; reaction?: string };

    if (!slug || !reaction || !VALID_REACTIONS.has(reaction)) {
      return NextResponse.json(
        { error: "Invalid slug or reaction type" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Try to read the post and its current reactions JSON
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("id, reactions")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (fetchError || !post) {
      // Post not found or reactions column doesn't exist yet — gracefully return success
      return NextResponse.json({ success: true, note: "post_not_found_or_column_missing" });
    }

    // Build updated reactions object
    const current =
      post.reactions && typeof post.reactions === "object"
        ? (post.reactions as Record<string, number>)
        : {};

    const updated = {
      ...current,
      [reaction]: (current[reaction] ?? 0) + 1,
    };

    const { error: updateError } = await supabase
      .from("posts")
      .update({ reactions: updated })
      .eq("id", post.id);

    if (updateError) {
      // Column might not exist yet — handle gracefully
      console.error("Failed to update reactions:", updateError.message);
      return NextResponse.json({ success: true, note: "update_failed_gracefully" });
    }

    return NextResponse.json({ success: true, reactions: updated });
  } catch (err) {
    console.error("Reactions API error:", err);
    return NextResponse.json({ success: true, note: "unexpected_error" });
  }
}
