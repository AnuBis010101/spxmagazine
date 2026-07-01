'use client';

import { useEffect, useRef } from 'react';

export function ViewCounter({ postId }: { postId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode's double-invoke in dev.
    if (fired.current) return;
    fired.current = true;

    // Count each post at most once per browser session.
    const key = `spx_viewed_${postId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // sessionStorage unavailable — fall through and still count once.
    }

    // Fire-and-forget — don't block render.
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(() => {});
  }, [postId]);

  return null;
}
