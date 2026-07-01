import type { Post } from "@/types/content";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { buildOgImageUrl } from "@/lib/utils/og-url";

/**
 * Emits Article / NewsArticle structured data (JSON-LD) for a post detail page,
 * making it eligible for rich results and Top Stories.
 */
export default function ArticleJsonLd({ post, url }: { post: Post; url: string }) {
  const image =
    post.og_image ||
    post.cover_image ||
    buildOgImageUrl({
      title: post.title,
      author: post.author_name,
      category: post.category?.name,
      type: post.content_type,
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.content_type === "news" ? "NewsArticle" : "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: [image],
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: { "@type": "Person", name: post.author_name },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/spxlogo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
