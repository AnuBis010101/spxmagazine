import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format-date";
import { estimateReadingTime } from "@/lib/utils/slugify";
import TiltCard from "@/components/animations/TiltCard";
import TypographicCover from "@/components/content/TypographicCover";
import type { Post } from "@/types/content";

const contentTypePathMap: Record<string, string> = {
  news: "/news/",
  article: "/articles/",
  learn: "/learn/",
};

interface ArticleCardProps {
  post: Post;
  variant?: "default" | "horizontal" | "compact";
}

export default function ArticleCard({
  post,
  variant = "default",
}: ArticleCardProps) {
  const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;
  const readingTime = post.body_html ? estimateReadingTime(post.body_html) : null;

  if (variant === "compact") {
    return (
      <li className="flex items-start gap-2">
        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
        <Link
          href={href}
          className="text-sm font-display font-medium text-white hover:text-gold-400 transition-colors line-clamp-1"
        >
          {post.title}
        </Link>
      </li>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={href} className="group flex gap-4">
        <div data-vt-cover className="w-28 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.cover_image_alt ?? post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="112px"
            />
          ) : (
            <TypographicCover title={post.title} seed={post.slug} size="sm" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-sm text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-mag-muted mt-1">
            {post.author_name && (
              <span className="text-gold-400/70">{post.author_name}</span>
            )}
            {post.author_name && post.published_at && <span>&middot;</span>}
            {post.published_at && (
              <span>{formatDate(post.published_at)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <TiltCard>
      <Link
        href={href}
        className="group rounded-xl overflow-hidden bg-mag-dark border border-mag-border hover:border-gold-400/40 transition-all duration-300 block hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)]"
      >
        <div data-vt-cover className="aspect-video relative overflow-hidden">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.cover_image_alt ?? post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <TypographicCover title={post.title} seed={post.slug} size="lg" />
          )}
          {post.category && (
            <span className="absolute top-3 left-3 bg-gold-400 text-mag-black text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {post.category.name}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-lg text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-mag-muted line-clamp-2 mt-2">
              {post.excerpt}
            </p>
          )}
          {post.author_name && (
            <p className="text-xs text-gold-400/80 font-medium mt-2">
              By {post.author_name}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs text-mag-muted">
            {post.published_at && (
              <span>{formatDate(post.published_at)}</span>
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
          </div>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-display font-semibold uppercase tracking-[0.14em] text-gold-400">
            <span className="bg-[linear-gradient(var(--color-gold-400),var(--color-gold-400))] bg-no-repeat bg-[position:0_100%] bg-[length:0%_2px] pb-0.5 transition-[background-size] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_2px]">
              Read
            </span>
            <span aria-hidden className="translate-x-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
