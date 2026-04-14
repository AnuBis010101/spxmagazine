export default function HomeSkeleton() {
  return (
    <div>
      {/* Hero area */}
      <div className="relative overflow-hidden" style={{ height: "calc(100svh - 102px)" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          {/* Logo */}
          <div className="w-[100px] h-[100px] rounded-full animate-shimmer" />
          {/* Title */}
          <div className="h-12 w-80 max-w-[80vw] rounded-lg animate-shimmer" />
          {/* Divider */}
          <div className="h-[2px] w-48 bg-gold-400/20 rounded" />
          {/* Subtitle */}
          <div className="h-5 w-52 rounded animate-shimmer" />
          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full animate-shimmer" />
            ))}
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div style={{ position: "relative", zIndex: 10, backgroundColor: "rgba(10,10,10,0.65)", backdropFilter: "blur(12px)" }}>
        {/* Category showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="h-8 w-64 rounded-lg animate-shimmer mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl border border-mag-border/50 animate-shimmer" />
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 rounded-lg animate-shimmer mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg animate-shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded animate-shimmer" />
                  <div className="h-3 w-1/4 rounded animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured carousel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="h-8 w-56 rounded-lg animate-shimmer mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-mag-border/50 bg-mag-dark overflow-hidden">
                <div className="aspect-video animate-shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded animate-shimmer" />
                  <div className="h-3 w-full rounded animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
