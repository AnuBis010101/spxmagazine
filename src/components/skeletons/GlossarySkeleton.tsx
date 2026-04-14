export default function GlossarySkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered header */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-mag-border/50" />
            <div className="h-3 w-32 rounded animate-shimmer" />
            <div className="h-px w-8 bg-mag-border/50" />
          </div>

          {/* Large title */}
          <div className="h-12 w-96 max-w-full mx-auto rounded-lg animate-shimmer mt-5" />

          {/* Subtitle */}
          <div className="h-4 w-80 max-w-full mx-auto rounded animate-shimmer mt-5" />
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mt-10">
          <div className="h-14 w-full rounded-2xl border border-mag-border/50 animate-shimmer" />
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-6 mt-8">
          <div className="h-4 w-28 rounded animate-shimmer" />
          <div className="h-4 w-28 rounded animate-shimmer" />
        </div>

        {/* Alphabet nav */}
        <div className="flex flex-wrap justify-center gap-1 mt-8">
          {Array.from({ length: 27 }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded-lg animate-shimmer" />
          ))}
        </div>

        {/* Term sections */}
        <div className="mt-14 space-y-16">
          {["A", "B", "C"].map((letter) => (
            <div key={letter}>
              {/* Letter header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-xl animate-shimmer" />
                <div className="h-px flex-1 bg-mag-border/30" />
              </div>
              {/* Term cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-mag-border/50 p-6 space-y-3">
                    <div className="h-5 w-1/2 rounded animate-shimmer" />
                    <div className="h-3 w-full rounded animate-shimmer" />
                    <div className="h-3 w-3/4 rounded animate-shimmer" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
