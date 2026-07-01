import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/supabase/verify-admin";

export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const path = body.path || "/";

  revalidatePath(path);
  revalidatePath("/");

  return NextResponse.json({ revalidated: true, path });
}
