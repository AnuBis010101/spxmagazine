"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils/format-date";
import StaggerContainer from "@/components/animations/StaggerContainer";
import StaggerItem from "@/components/animations/StaggerItem";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TypographicCover from "@/components/content/TypographicCover";
import SectionHeading from "@/components/ui/SectionHeading";
import { SPRING } from "@/lib/motion";
import type { Post } from "@/types/content";

const contentTypePathMap: Record<string, string> = {
  news: "/news/",
  article: "/articles/",
  learn: "/learn/",
};

interface CategoryShowcaseProps {
  news: Post[];
  articles: Post[];
  learn: Post[];
}

const tabs = [
  { key: "news" as const, label: "NEWS", href: "/news" },
  { key: "articles" as const, label: "ARTICLES", href: "/articles" },
  { key: "learn" as const, label: "LEARN", href: "/learn" },
];

function CardImage({
  post,
  sizes,
  size = "lg",
}: {
  post: Post;
  sizes: string;
  size?: "sm" | "lg";
}) {
  return post.cover_image ? (
    <Image
      src={post.cover_image}
      alt={post.cover_image_alt ?? post.title}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      sizes={sizes}
    />
  ) : (
    <TypographicCover title={post.title} seed={post.slug} size={size} />
  );
}

function CardOverlay({ post }: { post: Post }) {
  const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;
  return (
    <Link href={href} className="group block h-full relative">
      <CardImage post={post} sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-mag-black via-mag-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {post.category && (
          <span className="inline-block bg-gold-400/90 text-mag-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
            {post.category.name}
          </span>
        )}
        <h3 className="font-display font-bold text-lg text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-mag-light/70 line-clamp-2 mt-1.5 hidden md:block">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-mag-muted mt-2">
          <span>{post.author_name}</span>
          {post.published_at && (
            <>
              <span>&middot;</span>
              <span>{formatDate(post.published_at)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ post }: { post: Post }) {
  const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;
  return (
    <Link href={href} className="group flex gap-4 items-center">
      <div className="w-20 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
        <CardImage post={post} sizes="80px" size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-sm text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
          {post.title}
        </h4>
        {post.published_at && (
          <p className="text-xs text-mag-muted mt-1">{formatDate(post.published_at)}</p>
        )}
      </div>
    </Link>
  );
}

function NewsLayout({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <EmptyState label="news" />;
  const [main, ...rest] = posts;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Large card left */}
      <StaggerItem className="md:row-span-3 rounded-xl overflow-hidden relative min-h-[300px] md:min-h-[400px] border border-mag-border hover:border-gold-400/40 transition-colors">
        <CardOverlay post={main} />
      </StaggerItem>
      {/* Stacked right */}
      {rest.map((post) => (
        <StaggerItem
          key={post.id}
          className="rounded-xl overflow-hidden bg-mag-dark border border-mag-border hover:border-gold-400/40 transition-all p-4 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)]"
        >
          <SmallCard post={post} />
        </StaggerItem>
      ))}
    </div>
  );
}

function ArticlesLayout({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <EmptyState label="articles" />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => {
        const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;
        return (
          <StaggerItem
            key={post.id}
            className="rounded-xl overflow-hidden bg-mag-dark border border-mag-border hover:border-gold-400/40 transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)]"
          >
            <Link href={href} className="group block">
              <div className="aspect-[4/3] relative overflow-hidden">
                <CardImage post={post} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-4">
                {post.category && (
                  <span className="inline-block bg-gold-400/90 text-mag-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    {post.category.name}
                  </span>
                )}
                <h3 className="font-display font-bold text-base text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-mag-muted mt-2">
                  <span>{post.author_name}</span>
                  {post.published_at && (
                    <>
                      <span>&middot;</span>
                      <span>{formatDate(post.published_at)}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </div>
  );
}

function LearnLayout({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <EmptyState label="guides" />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post, idx) => {
        const href = `${contentTypePathMap[post.content_type] ?? "/learn/"}${post.slug}`;
        return (
          <StaggerItem
            key={post.id}
            className="rounded-xl overflow-hidden bg-mag-dark border border-mag-border hover:border-gold-400/40 transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)] group"
          >
            <Link href={href} className="flex gap-4 p-5 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center">
                <span className="font-display font-bold text-gold-400 text-lg">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-mag-muted line-clamp-2 mt-1.5">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-mag-muted mt-2">
                  <span>{post.author_name}</span>
                  {post.published_at && (
                    <>
                      <span>&middot;</span>
                      <span>{formatDate(post.published_at)}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-mag-muted">
      <p>No {label} published yet.</p>
    </div>
  );
}

export default function CategoryShowcase({ news, articles, learn }: CategoryShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"news" | "articles" | "learn">("news");

  const dataMap = { news, articles, learn };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ScrollReveal className="mb-10">
        <SectionHeading
          folio="01"
          align="center"
          eyebrow="Departments"
          title={<>Explore the <span className="text-gold-static">Latest</span></>}
          standfirst="Discover fresh content across all categories"
        />
      </ScrollReveal>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="relative inline-flex gap-1 bg-mag-dark rounded-full p-1 border border-mag-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative z-10 px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-colors duration-300"
              style={{
                color: activeTab === tab.key ? "#0A0A0A" : "#6B7280",
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gold-400 rounded-full"
                  style={{ zIndex: -1 }}
                  transition={SPRING.snappy}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <StaggerContainer staggerDelay={0.1}>
            {activeTab === "news" && <NewsLayout posts={dataMap.news} />}
            {activeTab === "articles" && <ArticlesLayout posts={dataMap.articles} />}
            {activeTab === "learn" && <LearnLayout posts={dataMap.learn} />}
          </StaggerContainer>

          {dataMap[activeTab].length > 0 && (
            <div className="mt-12 flex justify-center">
              <Link
                href={tabs.find((t) => t.key === activeTab)!.href}
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-mag-muted transition-colors duration-300 hover:text-gold-400"
              >
                View all {tabs.find((t) => t.key === activeTab)!.label.toLowerCase()}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
