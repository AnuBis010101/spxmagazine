import type { Metadata } from "next";
import { Suspense } from "react";
import { FRESH_WINDOW_DAYS, POSTS_PER_PAGE } from "@/lib/constants";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import { getPostsSplitByFreshness, getAllTags } from "@/lib/queries/articles";
import ArticleGrid from "@/components/content/ArticleGrid";
import Pagination from "@/components/content/Pagination";
import { TagFilter } from "@/components/content/TagFilter";
import ScrollReveal from "@/components/animations/ScrollReveal";

export function generateMetadata(): Metadata {
  return {
    title: `News`,
    description: "The latest from the SPX6900 ecosystem.",
    openGraph: {
      images: [{ url: buildOgImageUrl({ title: "News", subtitle: "The latest from the SPX6900 ecosystem" }), width: 1200, height: 630 }],
    },
  };
}

export const revalidate = 60;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { page: pageParam, tag } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  /* News ages out of the lead section on its own: anything published inside
     the freshness window is "This week", everything older falls through to
     "Earlier". Nothing is hidden or deleted — permalinks, tags and search all
     keep working, so this needs no upkeep once it's running. */
  const [{ fresh, earlier, earlierTotal }, allTags] = await Promise.all([
    getPostsSplitByFreshness("news", FRESH_WINDOW_DAYS, currentPage, POSTS_PER_PAGE, tag),
    getAllTags("news"),
  ]);

  // The lead section belongs to page 1; deeper pages are pure archive.
  const freshPosts = currentPage === 1 ? fresh : [];
  const totalPages = Math.ceil(earlierTotal / POSTS_PER_PAGE);
  const hasAnything = freshPosts.length > 0 || earlier.length > 0;

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              News
            </h1>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            <p className="text-mag-muted mt-4 text-lg">
              The latest from the SPX6900 ecosystem
            </p>
            <Suspense>
              <TagFilter tags={allTags} activeTag={tag} />
            </Suspense>
          </div>
        </ScrollReveal>

        {/* This week */}
        {freshPosts.length > 0 && (
          <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
            <div className="mt-10">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold-400">
                This week
              </h2>
              <div className="mt-6">
                <ArticleGrid posts={freshPosts} />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Earlier — where news lands once it ages past the window */}
        {earlier.length > 0 && (
          <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
            <div className={freshPosts.length > 0 ? "mt-14" : "mt-10"}>
              {freshPosts.length > 0 && (
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-mag-muted">
                  Earlier
                </h2>
              )}
              <div className={freshPosts.length > 0 ? "mt-6" : ""}>
                <ArticleGrid posts={earlier} />
              </div>
            </div>
          </ScrollReveal>
        )}

        {!hasAnything && (
          <p className="text-mag-muted text-center py-16">No news articles found.</p>
        )}

        {/* Pagination */}
        <ScrollReveal direction="up" blur duration={0.5} delay={0.2}>
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/news"
              extraParams={{ tag }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
