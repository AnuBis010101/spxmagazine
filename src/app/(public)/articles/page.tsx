import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_NAME, POSTS_PER_PAGE } from "@/lib/constants";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import { getPublishedPosts, getAllTags } from "@/lib/queries/articles";
import ArticleGrid from "@/components/content/ArticleGrid";
import Pagination from "@/components/content/Pagination";
import { TagFilter } from "@/components/content/TagFilter";
import ScrollReveal from "@/components/animations/ScrollReveal";

const COMMUNITY_EXCLUDE_TAG = "spx-magazine";

export function generateMetadata(): Metadata {
  return {
    title: `Community Articles | ${SITE_NAME}`,
    description: "Voices, analysis, and editorial from the SPX6900 community.",
    openGraph: {
      images: [{ url: buildOgImageUrl({ title: "Community Articles", subtitle: "Voices from the SPX6900 community" }), width: 1200, height: 630 }],
    },
  };
}

export const revalidate = 60;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { page: pageParam, tag } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [{ posts, total }, allTags] = await Promise.all([
    getPublishedPosts("article", currentPage, POSTS_PER_PAGE, tag, COMMUNITY_EXCLUDE_TAG),
    getAllTags("article", COMMUNITY_EXCLUDE_TAG),
  ]);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              Community Articles
            </h1>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            <p className="text-mag-muted mt-4 text-lg">
              Voices from the SPX6900 community
            </p>
            <Suspense>
              <TagFilter tags={allTags} activeTag={tag} />
            </Suspense>
          </div>
        </ScrollReveal>

        {/* Articles */}
        <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
          <div className="mt-10">
            {posts.length > 0 ? (
              <ArticleGrid posts={posts} />
            ) : (
              <p className="text-mag-muted text-center py-16">
                No articles found.
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Pagination */}
        <ScrollReveal direction="up" blur duration={0.5} delay={0.2}>
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/articles"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
