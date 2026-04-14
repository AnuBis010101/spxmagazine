export default function ArticleDetailSkeleton() {
  return (
    <article className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 rounded animate-shimmer" />
        <div className="h-4 w-2 rounded animate-shimmer" />
        <div className="h-4 w-16 rounded animate-shimmer" />
        <div className="h-4 w-2 rounded animate-shimmer" />
        <div className="h-4 w-40 rounded animate-shimmer" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Cover image */}
        <div className="aspect-video rounded-xl animate-shimmer mt-6" />

        {/* Category badge */}
        <div className="mt-6">
          <div className="h-6 w-20 rounded-full animate-shimmer" />
        </div>

        {/* Title */}
        <div className="mt-4 space-y-3">
          <div className="h-10 w-full rounded-lg animate-shimmer" />
          <div className="h-10 w-3/4 rounded-lg animate-shimmer" />
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-4 w-24 rounded animate-shimmer" />
          <div className="h-4 w-28 rounded animate-shimmer" />
          <div className="h-4 w-20 rounded animate-shimmer" />
          <div className="h-4 w-16 rounded animate-shimmer" />
        </div>
      </div>

      {/* Body + TOC */}
      <div className="mt-10 flex gap-8 max-w-4xl mx-auto lg:max-w-7xl">
        {/* Body */}
        <div className="flex-1 max-w-4xl">
          <div className="rounded-2xl border border-mag-border/50 p-6 md:p-10 space-y-4">
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-11/12 rounded animate-shimmer" />
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-3/4 rounded animate-shimmer" />
            <div className="h-8 mt-2" />
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-5/6 rounded animate-shimmer" />
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-2/3 rounded animate-shimmer" />
          </div>
        </div>

        {/* TOC sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-3">
          <div className="h-5 w-36 rounded animate-shimmer" />
          <div className="h-3 w-full rounded animate-shimmer" />
          <div className="h-3 w-3/4 rounded animate-shimmer" />
          <div className="h-3 w-5/6 rounded animate-shimmer" />
          <div className="h-3 w-2/3 rounded animate-shimmer" />
          <div className="h-3 w-full rounded animate-shimmer" />
        </aside>
      </div>
    </article>
  );
}
