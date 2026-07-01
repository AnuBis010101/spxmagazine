"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerContainer from "@/components/animations/StaggerContainer";
import StaggerItem from "@/components/animations/StaggerItem";
import type { EmbeddedTweet } from "@/types/content";

interface CommunityPulseProps {
  tweets: EmbeddedTweet[];
}

function TweetCard({ tweet }: { tweet: EmbeddedTweet }) {
  return (
    <a
      href={tweet.tweet_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[300px] sm:w-[340px] block group"
    >
      <div className="glass rounded-xl p-5 h-full hover:border-gold-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,175,55,0.1)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gold-400">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              @{tweet.author_handle || "SPX6900"}
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-auto text-mag-muted flex-shrink-0 group-hover:text-gold-400 transition-colors">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {tweet.caption && (
          <p className="text-sm text-mag-light/80 line-clamp-4 leading-relaxed">
            {tweet.caption}
          </p>
        )}
        {!tweet.caption && (
          <p className="text-sm text-mag-muted italic">View on X</p>
        )}
      </div>
    </a>
  );
}

export default function CommunityPulse({ tweets }: CommunityPulseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || tweets.length <= 2) return;

    let animId: number;
    let lastTime = 0;
    const speed = 0.5; // px per frame

    function step(time: number) {
      if (!isPaused && el) {
        if (lastTime) {
          const delta = time - lastTime;
          el.scrollLeft += speed * (delta / 16);
          // Loop back
          if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
            el.scrollLeft = 0;
          }
        }
        lastTime = time;
      } else {
        lastTime = 0;
      }
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, tweets.length]);

  if (tweets.length === 0) return null;

  return (
    <section className="py-16 md:py-24 overflow-hidden border-t border-mag-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Community <span className="text-gold-gradient">Pulse</span>
            </h2>
            <motion.div
              className="w-3 h-3 rounded-full bg-gold-400"
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-mag-muted mt-2">Voices from the SPX6900 community on X</p>
        </ScrollReveal>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerCancel={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-5 pl-4 sm:pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-8 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <StaggerContainer staggerDelay={0.08} className="flex gap-5">
          {tweets.map((tweet) => (
            <StaggerItem key={tweet.id}>
              <TweetCard tweet={tweet} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
