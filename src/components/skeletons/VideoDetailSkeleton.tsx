export default function VideoDetailSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video player */}
        <div className="aspect-video rounded-xl animate-shimmer" />

        {/* Title */}
        <div className="h-8 w-3/4 rounded-lg animate-shimmer mt-8" />

        {/* Description */}
        <div className="space-y-3 mt-4">
          <div className="h-4 w-full rounded animate-shimmer" />
          <div className="h-4 w-2/3 rounded animate-shimmer" />
        </div>
      </div>
    </section>
  );
}
