export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-48 bg-mag-border/50 rounded-lg mb-3" />
      <div className="h-4 w-72 bg-mag-border/30 rounded mb-10" />

      {/* Cards skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-mag-dark border border-mag-border/50">
            <div className="aspect-video bg-mag-border/30" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-mag-border/40 rounded" />
              <div className="h-3 w-full bg-mag-border/20 rounded" />
              <div className="h-3 w-1/2 bg-mag-border/20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
