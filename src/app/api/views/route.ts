import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });

    const supabase = createAdminClient();

    // Fetch current count then increment
    const { data } = await supabase
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .single();

    if (data) {
      await supabase
        .from('posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', postId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
