import type { Metadata } from "next";
import { Search } from "lucide-react";
import { searchPosts } from "@/lib/queries/articles";
import ArticleGrid from "@/components/content/ArticleGrid";
import ScrollReveal from "@/components/animations/ScrollReveal";

export function generateMetadata(): Metadata {
  return {
    title: `Search`,
    robots: { index: false, follow: true },
  };
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchPosts(query) : [];

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              {query ? `Results for '${query}'` : "Search"}
            </h1>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
          </div>
        </ScrollReveal>

        {/* Search form */}
        <ScrollReveal direction="up" blur duration={0.5} delay={0.1}>
        <form action="/search" method="GET" className="mt-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mag-muted" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search articles, news, guides..."
              className="w-full h-12 pl-12 pr-4 bg-mag-dark border border-mag-border rounded-lg text-white placeholder:text-mag-muted focus:border-gold-400 outline-none transition-colors"
            />
          </div>
        </form>
        </ScrollReveal>

        {/* Results */}
        <ScrollReveal direction="up" scale blur duration={0.7} delay={0.15}>
        <div className="mt-10">
          {query ? (
            results.length > 0 ? (
              <ArticleGrid posts={results} />
            ) : (
              <div className="text-center py-16">
                <p className="text-mag-muted text-lg">
                  No results found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-mag-muted text-sm mt-2">
                  Try different keywords or check your spelling.
                </p>
              </div>
            )
          ) : (
            <p className="text-mag-muted text-center py-16">
              Enter a search term to find articles, news, and guides.
            </p>
          )}
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
