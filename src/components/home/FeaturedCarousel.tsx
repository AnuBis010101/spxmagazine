"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent, animate } from "framer-motion";
import { formatDate } from "@/lib/utils/format-date";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TypographicCover from "@/components/content/TypographicCover";
import type { Post } from "@/types/content";

const contentTypePathMap: Record<string, string> = {
  news: "/news/",
  article: "/articles/",
  learn: "/learn/",
};

interface FeaturedCarouselProps {
  posts: Post[];
}

function TiltCard({ post }: { post: Post }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });

  const href = `${contentTypePathMap[post.content_type] ?? "/articles/"}${post.slug}`;

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="flex-shrink-0 w-[320px] sm:w-[360px] cursor-grab active:cursor-grabbing"
    >
      <Link href={href} className="group block" draggable={false}>
        <div className="rounded-xl overflow-hidden bg-mag-dark border border-mag-border hover:border-gold-400/40 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(212,175,55,0.15)]">
          <div className="aspect-[3/4] relative overflow-hidden">
            {post.cover_image ? (
              <Image
                src={post.cover_image}
                alt={post.cover_image_alt ?? post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="360px"
                draggable={false}
              />
            ) : (
              <TypographicCover title={post.title} seed={post.slug} size="lg" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-mag-black via-transparent to-transparent" />
            {post.category && (
              <span className="absolute top-3 left-3 bg-gold-400/90 text-mag-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {post.category.name}
              </span>
            )}
          </div>
          <div className="p-4">
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
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [dragWidth, setDragWidth] = useState(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // Recompute the drag range on mount, when posts change, and on resize (the
  // old ref-callback never updated on viewport changes).
  const measure = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    setDragWidth(Math.max(0, node.scrollWidth - node.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, posts.length]);

  // Map the drag offset onto an active dot; only re-render when it changes.
  useMotionValueEvent(x, "change", (latest) => {
    const idx =
      dragWidth <= 0 || posts.length <= 1
        ? 0
        : Math.round(Math.min(1, Math.max(0, -latest / dragWidth)) * (posts.length - 1));
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  });

  const goTo = (i: number) => {
    if (posts.length <= 1) return;
    const target = -(i / (posts.length - 1)) * dragWidth;
    animate(x, target, { type: "spring", stiffness: 300, damping: 40 });
  };

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Featured <span className="text-gold-static">Stories</span>
          </h2>
          <p className="text-mag-muted mt-2">Handpicked reads from our editors</p>
        </ScrollReveal>
      </div>

      <div className="perspective-1000">
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.1}
          className="flex gap-5 pl-4 sm:pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-8 cursor-grab active:cursor-grabbing"
        >
          {posts.map((post) => (
            <TiltCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>

      {/* Dot indicators — click to scroll, reflect the dragged position */}
      {posts.length > 1 && (
        <div className="flex justify-center items-center gap-1 mt-8">
          {posts.map((post, i) => (
            <button
              key={post.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to featured story ${i + 1}`}
              aria-current={i === active}
              className="flex h-8 w-8 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-gold-400" : "w-2 bg-mag-border hover:bg-gold-400/50"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
