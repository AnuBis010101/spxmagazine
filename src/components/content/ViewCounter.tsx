'use client';

import { useEffect } from 'react';

export function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    // Fire-and-forget — don't block render
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(() => {});
  }, [postId]);

  return null;
}
