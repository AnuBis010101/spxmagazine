export default function ListingPageSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="h-9 w-44 rounded-lg animate-shimmer" />
        <div className="h-0.5 w-16 bg-gold-400/30 mt-3" />
        <div className="h-4 w-72 rounded animate-shimmer mt-4" />

        {/* Tag filter pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 rounded-full animate-shimmer" style={{ width: 56 + Math.round(i * 11 % 40) }} />
          ))}
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
                <div className="h-3 w-1/3 rounded animate-shimmer mt-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-10 rounded-lg animate-shimmer" />
          ))}
        </div>
      </div>
    </section>
  );
}
