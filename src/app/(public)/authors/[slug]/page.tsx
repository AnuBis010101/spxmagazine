import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import { getAuthorBySlug, getAllAuthors } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/queries/authors";
import ArticleGrid from "@/components/content/ArticleGrid";
import ScrollReveal from "@/components/animations/ScrollReveal";

export async function generateStaticParams() {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { title: `Author Not Found | ${SITE_NAME}` };

  return {
    title: `${author.name} | ${SITE_NAME}`,
    description: author.bio,
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = await getPostsByAuthor(author.name);

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Author header */}
        <ScrollReveal direction="up" blur duration={0.6}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          {author.avatar ? (
            <div className="w-24 h-24 rounded-full overflow-hidden relative flex-shrink-0 ring-2 ring-gold-400/50">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-400/5 border-2 border-gold-400/50 flex items-center justify-center flex-shrink-0">
              <span className="text-gold-400 font-display font-bold text-3xl">
                {author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="text-center sm:text-left">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              {author.name}
            </h1>
            <p className="text-gold-400 font-body text-sm font-medium mt-1">
              {author.role}
            </p>
            <p className="text-mag-muted font-body mt-3 max-w-2xl">
              {author.bio}
            </p>
            {author.twitter && (
              <a
                href={`https://x.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-mag-muted hover:text-gold-400 transition-colors mt-3"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @{author.twitter}
              </a>
            )}
          </div>
        </div>

        </ScrollReveal>

        {/* Divider */}
        <div className="w-full h-px bg-mag-border mt-10 mb-10">
          <div className="w-16 h-0.5 bg-gold-400" />
        </div>

        {/* Posts section */}
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-6">
              Articles by {author.name}
            </h2>
            {posts.length > 0 ? (
              <ArticleGrid posts={posts} />
            ) : (
              <p className="text-mag-muted text-center py-16">
                No published articles yet.
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/authors"
            className="text-sm text-mag-muted hover:text-gold-400 transition-colors"
          >
            &larr; All Authors
          </Link>
        </div>
      </div>
    </section>
  );
}
