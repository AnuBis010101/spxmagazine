import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { getAuthorByName } from "@/lib/authors";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries/articles";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import ArticleJsonLd from "@/components/content/ArticleJsonLd";
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
import LineReveal from "@/components/animations/LineReveal";
import ChapterSpine from "@/components/content/ChapterSpine";
import GlossaryHighlighter from "@/components/content/GlossaryHighlighter";
import AudioPlayer from "@/components/content/AudioPlayer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "learn");

  if (!post) {
    return { title: `Not Found` };
  }

  return {
    title: post.meta_title || post.title,
    alternates: { canonical: `/learn/${post.slug}` },
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author_name],
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: [
          {
            url: post.og_image || buildOgImageUrl({
              title: post.meta_title || post.title,
              author: post.author_name,
              category: post.category?.name,
              type: post.content_type,
            }),
            width: 1200,
            height: 630,
          },
        ],
    },
  };
}

export const revalidate = 60;

export default async function LearnArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "learn");

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category_id, 3, post.tags);
  const readingTime = post.body_html ? estimateReadingTime(post.body_html) : null;
  const articleUrl = `${SITE_URL}/learn/${post.slug}`;

  return (
    <>
    <ReadingProgress />
    <article className="max-w-7xl mx-auto px-4 py-12">
      <ArticleJsonLd post={post} url={articleUrl} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Guides", href: "/learn" },
        { label: post.title },
      ]} />

      <div className="max-w-4xl mx-auto">
        {/* Cover image — kept outside ScrollReveal so it is fully painted when a
            View Transition captures it (shared-element cover morph target). */}
        {post.cover_image && (
          <div
            data-vt-cover
            style={{ viewTransitionName: "spx-cover" }}
            className="aspect-video rounded-xl overflow-hidden relative mt-6"
          >
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

        <ScrollReveal direction="up" blur duration={0.6}>

        {post.category && (
          <div className="mt-6">
            <CategoryBadge name={post.category.name} color={post.category.color} />
          </div>
        )}

        <LineReveal
          title={post.title}
          className="font-display text-display-lg font-bold text-white mt-4 text-balance"
        />

        <ViewCounter postId={post.id} />

        <div className="flex items-center gap-3 text-sm text-mag-muted mt-4 flex-wrap">
          {(() => {
            const author = post.author_name ? getAuthorByName(post.author_name) : null;
            return author ? (
              <Link
                href={`/authors/${author.slug}`}
                className="text-gold-400/80 hover:text-gold-400 hover:underline underline-offset-2 transition-colors"
              >
                {post.author_name}
              </Link>
            ) : (
              <span>{post.author_name}</span>
            );
          })()}
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

        {/* Audio Player */}
        {post.body_html && (
          <div className="mt-6">
            <AudioPlayer slug={post.slug} title={post.title} estimatedMinutes={readingTime ?? undefined} />
          </div>
        )}
      </div>

      <div className="mt-10 max-w-4xl mx-auto xl:max-w-none xl:grid xl:grid-cols-[1fr_minmax(0,56rem)_16rem] xl:gap-8 xl:px-8">
        <ChapterSpine />

        <div>
          <div className="rounded-2xl bg-mag-dark border border-mag-border/50 p-6 md:p-10">
            <GlossaryHighlighter>
              <div
                id="article-body"
                className="prose-magazine"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body_html || "") }}
              />
            </GlossaryHighlighter>
          </div>

          <ReactionBar slug={post.slug} initialReactions={post.reactions ?? undefined} />

          <div className="mt-6 pt-6 border-t border-mag-border flex items-center justify-between">
            <span className="text-sm text-mag-muted">Share this article</span>
            <ShareButtons url={articleUrl} title={post.title} />
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TableOfContents />
          </div>
        </aside>
      </div>

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
