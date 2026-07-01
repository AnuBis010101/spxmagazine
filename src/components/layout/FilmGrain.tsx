"use client";

import { useEffect, useState } from "react";

/**
 * Static film-grain texture across the dark canvas.
 *
 * Two earlier attempts failed: an inline-SVG feTurbulence overlay rendered 0×0
 * under a Framer-transformed ancestor, and a CSS data-URI url() was dropped by
 * Tailwind v4's Lightning CSS. This avoids all three traps:
 *   - the noise is painted on a <canvas> and exported as a PNG data URL,
 *   - applied through a React inline style (never touched by Lightning CSS),
 *   - on a top-level fixed overlay with no transformed ancestor.
 * It is static (no flicker) so it is motion-free — nothing to gate for
 * prefers-reduced-motion — and uses plain opacity (no blend mode / filter) so
 * it adds no per-frame compositing cost while scrolling.
 */
export default function FilmGrain() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = ctx.createImageData(size, size);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);

    try {
      setUrl(canvas.toDataURL("image/png"));
    } catch {
      /* toDataURL can throw in locked-down contexts — skip the grain */
    }
  }, []);

  if (!url) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 9990, // above content, below the custom cursor (9998) + preloader (9999)
        backgroundImage: `url(${url})`,
        backgroundRepeat: "repeat",
        opacity: 0.1,
      }}
    />
  );
}
