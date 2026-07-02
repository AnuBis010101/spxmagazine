"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/types/content";
import CategoryBadge from "@/components/content/CategoryBadge";
import SectionHeading from "@/components/ui/SectionHeading";

const contentTypePathMap: Record<string, string> = {
  news: "/news/",
  article: "/articles/",
  learn: "/learn/",
};

interface TrendingArticlesProps {
  posts: Post[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function TrendingArticles({ posts }: TrendingArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        folio="02"
        eyebrow="Most Read"
        title="Trending Now"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-8 divide-y divide-mag-border"
      >
        {posts.map((post, index) => {
          const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;
          const num = String(index + 1).padStart(2, "0");

          return (
            <motion.div key={post.id} variants={itemVariants}>
              <Link
                href={href}
                className="group flex items-center gap-6 py-5 hover:bg-mag-dark/30 -mx-4 px-4 rounded-lg transition-colors"
              >
                <span className="font-display text-3xl md:text-4xl font-bold text-gold-400/30 group-hover:text-gold-400 transition-colors shrink-0">
                  {num}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base md:text-lg text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    {post.author_name && (
                      <span className="text-xs text-gold-400/70 font-medium">
                        {post.author_name}
                      </span>
                    )}
                    {post.category && (
                      <CategoryBadge name={post.category.name} />
                    )}
                    <span className="text-xs text-mag-muted">
                      {post.view_count.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-8">
        <Link
          href="/articles"
          className="group inline-flex items-center gap-2 text-sm font-display font-semibold text-gold-400/80 hover:text-gold-400 transition-colors"
        >
          View all
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
