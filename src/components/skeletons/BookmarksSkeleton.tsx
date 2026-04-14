export default function BookmarksSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Title */}
      <div className="mb-10">
        <div className="h-9 w-56 rounded-lg animate-shimmer" />
        <div className="h-0.5 w-16 bg-gold-400/30 mt-3" />
        <div className="h-3 w-72 rounded animate-shimmer mt-3" />
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-mag-border/50 bg-mag-dark">
            <div className="aspect-video animate-shimmer" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 rounded animate-shimmer" />
              <div className="h-3 w-full rounded animate-shimmer" />
              <div className="h-3 w-1/2 rounded animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
