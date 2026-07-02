import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import TypographicCover from "@/components/content/TypographicCover";
import type { Video } from "@/types/content";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl =
    video.thumbnail_url ??
    (video.youtube_id
      ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
      : null);

  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group rounded-xl overflow-hidden bg-mag-dark border border-mag-border hover:border-gold-400/30 transition-all duration-300 block"
    >
      <div className="aspect-video relative overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <TypographicCover title={video.title} seed={video.slug} size="lg" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gold-400/90 text-mag-black w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current" />
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-mag-muted line-clamp-1 mt-1">
            {video.description}
          </p>
        )}
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-display font-semibold uppercase tracking-[0.14em] text-gold-400">
          <span className="bg-[linear-gradient(var(--color-gold-400),var(--color-gold-400))] bg-no-repeat bg-[position:0_100%] bg-[length:0%_2px] pb-0.5 transition-[background-size] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_2px]">
            Watch
          </span>
          <span aria-hidden className="translate-x-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
