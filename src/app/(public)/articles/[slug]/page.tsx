import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries/articles";
import { formatDate } from "@/lib/utils/format-date";
import { estimateReadingTime } from "@/lib/utils/slugify";
import CategoryBadge from "@/components/content/CategoryBadge";
import ShareButtons from "@/components/content/ShareButtons";
import ArticleGrid from "@/components/content/ArticleGrid";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { ViewCounter } from "@/components/content/ViewCounter";
import Breadcrumbs from "@/components/content/Breadcrumbs";
import BookmarkButton from "@/components/content/BookmarkButton";
import TableOfContents from "@/components/content/TableOfContents";
import ReactionBar from "@/components/content/ReactionBar";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GlossaryHighlighter from "@/components/content/GlossaryHighlighter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: `Not Found | ${SITE_NAME}` };
  }

  return {
    title: `${post.meta_title || post.title} | ${SITE_NAME}`,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.og_image || post.cover_image ? [{ url: post.og_image || post.cover_image! }] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category_id, 3);
  const readingTime = post.body_html ? estimateReadingTime(post.body_html) : null;
  const articleUrl = `${SITE_URL}/articles/${post.slug}`;

  return (
    <>
    <ReadingProgress />
    <article className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Articles", href: "/articles" },
        { label: post.title },
      ]} />

      <div className="max-w-4xl mx-auto">
        {/* Cover image */}
        <ScrollReveal direction="up" blur duration={0.6}>
        {post.cover_image && (
          <div className="aspect-video rounded-xl overflow-hidden relative mt-6">
            <Image
              src={post.cover_image}
              alt={post.cover_image_alt ?? post.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Category badge */}
        {post.category && (
          <div className="mt-6">
            <CategoryBadge name={post.category.name} color={post.category.color} />
          </div>
        )}

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 leading-tight">
          {post.title}
        </h1>

        {/* View counter (fires on mount) */}
        <ViewCounter postId={post.id} />

        {/* Meta row */}
        <div className="flex items-center gap-3 text-sm text-mag-muted mt-4 flex-wrap">
          <span>{post.author_name}</span>
          {post.published_at && (
            <>
              <span>&middot;</span>
              <span>{formatDate(post.published_at)}</span>
            </>
          )}
          {readingTime && (
            <>
              <span>&middot;</span>
              <span>{readingTime} min read</span>
            </>
          )}
          {post.view_count > 0 && (
            <>
              <span>&middot;</span>
              <span>{post.view_count.toLocaleString()} views</span>
            </>
          )}
          <div className="ml-auto">
            <BookmarkButton slug={post.slug} />
          </div>
        </div>
        </ScrollReveal>
      </div>

      {/* Article body with optional TOC sidebar */}
      <div className="mt-10 flex gap-8 max-w-4xl mx-auto lg:max-w-7xl">
        <div className="flex-1 max-w-4xl">
          <div className="rounded-2xl bg-[#111] border border-mag-border/50 p-6 md:p-10">
            <GlossaryHighlighter>
              <div
                className="prose-magazine"
                dangerouslySetInnerHTML={{ __html: post.body_html || "" }}
              />
            </GlossaryHighlighter>
          </div>

          {/* Reactions */}
          <ReactionBar slug={post.slug} />

          {/* Share buttons */}
          <div className="mt-6 pt-6 border-t border-mag-border flex items-center justify-between">
            <span className="text-sm text-mag-muted">Share this article</span>
            <ShareButtons url={articleUrl} title={post.title} />
          </div>
        </div>

        {/* Table of Contents sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <TableOfContents />
        </aside>
      </div>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-white">
              Related Articles
            </h2>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            <div className="mt-8">
              <ArticleGrid posts={relatedPosts} />
            </div>
          </section>
        </ScrollReveal>
      )}
    </article>
    </>
  );
}
