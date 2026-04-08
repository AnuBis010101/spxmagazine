import Link from "next/link";
import type { Video } from "@/types/content";
import VideoPlayer from "@/components/content/VideoPlayer";

interface VideoHighlightProps {
  video: Video | null;
}

export default function VideoHighlight({ video }: VideoHighlightProps) {
  if (!video) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Featured Video
          </h2>
          <div className="w-16 h-0.5 bg-gold-400 mt-3" />
        </div>

        <div className="lg:grid lg:grid-cols-5 lg:gap-8 mt-8">
          {/* Video player */}
          <div className="lg:col-span-3">
            <VideoPlayer youtubeId={video.youtube_id} title={video.title} />
          </div>

          {/* Video info */}
          <div className="lg:col-span-2 mt-6 lg:mt-0 flex flex-col justify-center">
            <h3 className="font-display text-2xl font-bold text-white">
              {video.title}
            </h3>
            {video.description && (
              <p className="text-mag-muted mt-3 leading-relaxed">
                {video.description}
              </p>
            )}
            <div className="mt-6">
              <Link
                href="/videos"
                className="text-gold-400 font-medium hover:underline"
              >
                Watch more videos &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
