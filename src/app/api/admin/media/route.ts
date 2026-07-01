import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "@/lib/supabase/verify-admin";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// DELETE: remove a media item — deletes the storage object then the DB row.
// (?id=&path=storage_path)
export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const path = searchParams.get("path");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = getAdminClient();

  if (path) {
    // Best-effort storage removal; don't block the row delete if it fails.
    await supabase.storage.from("images").remove([path]);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
