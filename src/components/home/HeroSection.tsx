import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format-date";
import type { Post } from "@/types/content";

const contentTypePathMap: Record<string, string> = {
  news: "/news/",
  article: "/articles/",
  learn: "/learn/",
};

interface HeroSectionProps {
  post: Post | null;
}

export default function HeroSection({ post }: HeroSectionProps) {
  if (!post) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center bg-mag-dark">
        <div className="text-center px-4">
          <Image
            src="/spxlogo.png"
            alt="SPX6900 Logo"
            width={120}
            height={120}
            className="mx-auto"
            priority
          />
          <h1 className="font-display text-5xl font-bold mt-6 text-gold-gradient">
            SPX MAGAZINE
          </h1>
          <p className="text-mag-muted text-lg mt-3 max-w-md mx-auto">
            Your source for the latest SPX6900 news, insights, and culture.
          </p>
        </div>
      </section>
    );
  }

  const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* Background cover image */}
      {post.cover_image && (
        <Image
          src={post.cover_image}
          alt={post.cover_image_alt ?? post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-mag-black via-mag-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-end min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full">
          {post.category && (
            <span className="inline-block bg-gold-400 text-mag-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category.name}
            </span>
          )}

          <h1
            className={cn(
              "font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl",
              post.category ? "mt-4" : ""
            )}
            style={{ letterSpacing: "-0.02em" }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-mag-light/80 mt-4 max-w-2xl line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-mag-muted">
              <span>{post.author_name}</span>
              {post.published_at && (
                <>
                  <span>&middot;</span>
                  <span>{formatDate(post.published_at)}</span>
                </>
              )}
            </div>
            <Link
              href={href}
              className="bg-gold-400 text-mag-black px-6 py-2.5 rounded-full font-semibold hover:bg-gold-500 transition"
            >
              Read Article
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
