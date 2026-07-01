import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin as verifyAuth } from "@/lib/supabase/verify-admin";

// Service role client for admin operations (bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: Fetch a post (and categories) for editing
export async function GET(request: Request) {
  const isAuthed = await verifyAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const supabase = getAdminClient();

  const [categoriesRes, postRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    id
      ? supabase.from("posts").select("*, category:categories(*)").eq("id", id).single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  return NextResponse.json({
    post: postRes?.data ?? null,
    categories: categoriesRes.data ?? [],
  });
}

// PATCH: Update a post
export async function PATCH(request: Request) {
  const isAuthed = await verifyAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Admin post update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ data });
}

// POST: Create a post
export async function POST(request: Request) {
  const isAuthed = await verifyAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .insert(body)
    .select()
    .single();

  if (error) {
    console.error("Admin post create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ data });
}

// DELETE: Delete a post
export async function DELETE(request: Request) {
  const isAuthed = await verifyAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Admin post delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ success: true });
}
