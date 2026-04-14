export default function AuthorProfileSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Author header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full animate-shimmer shrink-0" />
          <div className="space-y-3 text-center sm:text-left">
            <div className="h-8 w-48 rounded-lg animate-shimmer" />
            <div className="h-4 w-24 rounded animate-shimmer" />
            <div className="h-3 w-96 max-w-full rounded animate-shimmer" />
            <div className="h-3 w-64 rounded animate-shimmer" />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 mb-10">
          <div className="h-px w-full bg-mag-border/30" />
          <div className="h-0.5 w-16 bg-gold-400/30 -mt-px" />
        </div>

        {/* Section heading */}
        <div className="h-6 w-48 rounded animate-shimmer mb-6" />

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-mag-border/50 bg-mag-dark">
              <div className="aspect-video animate-shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded animate-shimmer" />
                <div className="h-3 w-full rounded animate-shimmer" />
                <div className="h-3 w-1/3 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
