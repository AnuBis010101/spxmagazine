export default function VideosListingSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="h-9 w-36 rounded-lg animate-shimmer" />
        <div className="h-0.5 w-16 bg-gold-400/30 mt-3" />
        <div className="h-4 w-64 rounded animate-shimmer mt-4" />

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-mag-border/50 bg-mag-dark">
              <div className="aspect-video animate-shimmer relative">
                {/* Play button circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-2 border-mag-border/50" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 rounded animate-shimmer" />
                <div className="h-3 w-1/2 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
