"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { Video } from "@/types/content";

interface VideoSpotlightProps {
  video: Video | null;
}

export default function VideoSpotlight({ video }: VideoSpotlightProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!video) return null;

  const thumbnail =
    video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white text-center mb-2">
          Video <span className="text-gold-static">Spotlight</span>
        </h2>
        <p className="text-mag-muted text-center mb-12">
          Watch the latest from the SPX6900 community
        </p>
      </ScrollReveal>

      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Video (60%) */}
        <motion.div
          className="lg:col-span-3 relative rounded-xl overflow-hidden aspect-video border border-mag-border"
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title={video.title}
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="block w-full h-full relative group"
              aria-label={`Play ${video.title}`}
            >
              <Image
                src={thumbnail}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-mag-black/30 group-hover:bg-mag-black/10 transition-colors" />
              {/* Play button with sonar pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-gold-400"
                    animate={{
                      scale: [1, 1.8, 2.2],
                      opacity: [0.6, 0.2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    style={{ width: 72, height: 72, marginLeft: -36, marginTop: -36, left: "50%", top: "50%", position: "absolute" }}
                  />
                  <div className="w-[72px] h-[72px] rounded-full bg-gold-400/90 flex items-center justify-center group-hover:bg-gold-400 transition-colors shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7L8 5z" fill="#0A0A0A" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          )}
        </motion.div>

        {/* Info (40%) */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Decorative gold line */}
          <motion.div
            className="hidden lg:block w-1 h-16 bg-gold-400 rounded-full mb-6"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ transformOrigin: "top" }}
          />

          <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-mag-muted mt-3 leading-relaxed line-clamp-4">
              {video.description}
            </p>
          )}
          {video.duration && (
            <div className="flex items-center gap-2 mt-4 text-sm text-mag-muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gold-400">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{video.duration}</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
