"use client";

export default function ParallaxContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "rgba(10, 10, 10, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
