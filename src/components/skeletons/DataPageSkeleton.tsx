export default function DataPageSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="h-9 w-48 rounded-lg animate-shimmer" />
        <div className="h-0.5 w-16 bg-gold-400/30 mt-3" />
        <div className="h-4 w-96 max-w-full rounded animate-shimmer mt-4" />

        {/* Flippening tracker */}
        <div className="mt-12">
          <div className="h-7 w-64 rounded animate-shimmer mb-6" />
          <div className="h-80 rounded-2xl border border-mag-border/50 animate-shimmer" />
        </div>

        {/* Holders tracker */}
        <div className="mt-16">
          <div className="h-7 w-56 rounded animate-shimmer mb-4" />
          <div className="h-4 w-96 max-w-full rounded animate-shimmer mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl border border-mag-border/50 animate-shimmer" />
            ))}
          </div>
        </div>

        {/* Explanation grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-mag-border/50 p-6 md:p-8 space-y-4">
              <div className="h-6 w-48 rounded animate-shimmer" />
              <div className="h-0.5 w-12 bg-gold-400/30" />
              <div className="h-3 w-full rounded animate-shimmer" />
              <div className="h-3 w-5/6 rounded animate-shimmer" />
              <div className="h-3 w-full rounded animate-shimmer" />
              <div className="h-3 w-2/3 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
