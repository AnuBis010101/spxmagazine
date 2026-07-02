import type { Metadata } from "next";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import { getPublishedVideos } from "@/lib/queries/videos";
import VideoCard from "@/components/content/VideoCard";
import { Video } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ScrollReveal from "@/components/animations/ScrollReveal";

export function generateMetadata(): Metadata {
  return {
    title: `Videos`,
    description: "Watch the latest SPX6900 video content, tutorials, and community highlights.",
    // Videos section is hidden for now — keep it out of the index while unlinked.
    robots: { index: false, follow: false },
    openGraph: {
      images: [{ url: buildOgImageUrl({ title: "Videos", subtitle: "Video content, tutorials, and community highlights" }), width: 1200, height: 630 }],
    },
  };
}

export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getPublishedVideos(24);

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              Videos
            </h1>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            <p className="text-mag-muted mt-4 text-lg">
              Watch the latest from the SPX6900 community
            </p>
          </div>
        </ScrollReveal>

        {/* Video grid */}
        <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
        <div className="mt-10">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Video className="w-12 h-12 text-gold-400" />}
              title="Videos Coming Soon"
              description="We're preparing video content from the SPX6900 community. Subscribe to our newsletter to be notified when they go live."
              actionLabel="Browse Articles"
              actionHref="/articles"
            />
          )}
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
