"use client";

export default function ParallaxContent({ children }: { children: React.ReactNode }) {
  return (
    // Perf: a near-opaque panel replaces the old backdrop-filter: blur(12px).
    // Compositing a live blur over the always-animating fixed orbit re-sampled
    // the moving orbit every frame — the most expensive combo on the page and a
    // scroll-jank source on integrated GPUs / mobile Safari (audit hotspot),
    // made worse by the hero rack-focus blur landing right at this seam. The
    // orbit still glows faintly through the ~10% transparency, cheaply.
    <div
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "rgba(10, 10, 10, 0.9)",
      }}
    >
      {children}
    </div>
  );
}
