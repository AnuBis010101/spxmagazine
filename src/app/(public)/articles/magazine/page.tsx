import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, POSTS_PER_PAGE } from "@/lib/constants";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import { getPublishedPosts } from "@/lib/queries/articles";
import ArticleGrid from "@/components/content/ArticleGrid";
import Pagination from "@/components/content/Pagination";
import ScrollReveal from "@/components/animations/ScrollReveal";

const MAGAZINE_TAG = "spx-magazine";

export function generateMetadata(): Metadata {
  return {
    title: `SPX Magazine Articles | ${SITE_NAME}`,
    description: "Editorial and in-depth analysis from the SPX Magazine desk.",
    openGraph: {
      images: [{ url: buildOgImageUrl({ title: "SPX Magazine Articles", subtitle: "Editorial from the SPX Magazine desk" }), width: 1200, height: 630 }],
    },
  };
}

export const revalidate = 60;

export default async function MagazineArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { posts, total } = await getPublishedPosts(
    "article",
    currentPage,
    POSTS_PER_PAGE,
    MAGAZINE_TAG
  );
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              SPX Magazine Articles
            </h1>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            <p className="text-mag-muted mt-4 text-lg">
              Editorial from the SPX Magazine desk
            </p>
          </div>
        </ScrollReveal>

        {/* Articles */}
        <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
          <div className="mt-10">
            {posts.length > 0 ? (
              <ArticleGrid posts={posts} />
            ) : (
              <div className="text-center py-20 md:py-28">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400/70 mb-4">
                  <span className="w-8 h-px bg-gold-400/30" />
                  Coming Soon
                  <span className="w-8 h-px bg-gold-400/30" />
                </div>
                <p className="text-mag-light text-lg md:text-xl max-w-md mx-auto">
                  SPX Magazine editorial is on the way.
                </p>
                <p className="text-mag-muted mt-3 max-w-md mx-auto">
                  In the meantime, explore{" "}
                  <Link href="/articles" className="text-gold-400 hover:text-gold-300 transition-colors">
                    Community Articles
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Pagination */}
        {totalPages > 1 && (
          <ScrollReveal direction="up" blur duration={0.5} delay={0.2}>
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/articles/magazine"
              />
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
