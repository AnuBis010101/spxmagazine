"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  youtubeId: string;
  title?: string;
}

export default function VideoPlayer({ youtubeId, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-mag-dark relative">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title ?? "Video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 w-full h-full cursor-pointer group"
          aria-label={`Play ${title ?? "video"}`}
        >
          <Image
            src={thumbnailUrl}
            alt={title ?? "Video thumbnail"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gold-400/90 text-mag-black w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 fill-current" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
