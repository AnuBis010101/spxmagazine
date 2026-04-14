export default function SearchSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="h-9 w-32 rounded-lg animate-shimmer" />
        <div className="h-0.5 w-16 bg-gold-400/30 mt-3" />

        {/* Search input */}
        <div className="mt-8 max-w-xl">
          <div className="h-12 w-full rounded-lg border border-mag-border/50 animate-shimmer" />
        </div>

        {/* Empty results placeholder */}
        <div className="mt-10 flex justify-center">
          <div className="h-4 w-64 rounded animate-shimmer" />
        </div>
      </div>
    </section>
  );
}
