export default function AuthorsListingSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="h-9 w-36 rounded-lg animate-shimmer" />
        <div className="h-0.5 w-16 bg-gold-400/30 mt-3" />
        <div className="h-4 w-72 rounded animate-shimmer mt-4" />

        {/* Author cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-mag-border/50 bg-mag-dark p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full animate-shimmer" />
              {/* Name */}
              <div className="h-5 w-32 rounded animate-shimmer mt-4" />
              {/* Role */}
              <div className="h-3 w-20 rounded animate-shimmer mt-2" />
              {/* Bio */}
              <div className="h-3 w-full rounded animate-shimmer mt-3" />
              <div className="h-3 w-3/4 rounded animate-shimmer mt-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
