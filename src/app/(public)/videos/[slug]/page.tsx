import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideoBySlug } from "@/lib/queries/videos";
import VideoPlayer from "@/components/content/VideoPlayer";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    return { title: `Not Found` };
  }

  return {
    title: `${video.title}`,
    description: video.description || undefined,
    openGraph: {
      title: video.title,
      description: video.description || undefined,
      images: video.thumbnail_url
        ? [{ url: video.thumbnail_url }]
        : [{ url: `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg` }],
    },
  };
}

export const revalidate = 60;

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video player */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <VideoPlayer youtubeId={video.youtube_id} title={video.title} />
        </ScrollReveal>

        {/* Video info */}
        <ScrollReveal direction="up" blur duration={0.6} delay={0.15}>
          <div className="mt-8">
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {video.title}
            </h1>
            {video.description && (
              <p className="text-mag-muted mt-4 text-lg leading-relaxed">
                {video.description}
              </p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
