import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { getHeroPost, getFeaturedPosts, getLatestByContentType, getTrendingPosts } from "@/lib/queries/articles";
import { getFeaturedVideo } from "@/lib/queries/videos";
import { getSidebarTweets } from "@/lib/queries/tweets";
import { getGlossaryTerms } from "@/lib/queries/glossary";
import ScrollProgress from "@/components/home/ScrollProgress";
import AnimatedHero from "@/components/home/AnimatedHero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import VideoSpotlight from "@/components/home/VideoSpotlight";
import CommunityPulse from "@/components/home/CommunityPulse";
import AnimatedNewsletterCTA from "@/components/home/AnimatedNewsletterCTA";
import FlippeningTracker from "@/components/widgets/FlippeningTracker";
import TrendingArticles from "@/components/home/TrendingArticles";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ParallaxContent from "@/components/home/ParallaxContent";

export const metadata: Metadata = {
  title: `${SITE_NAME} | The Voice of SPX6900`,
};

export const revalidate = 60;

export default async function HomePage() {
  const [
    heroPost,
    featuredPosts,
    newsLatest,
    articlesLatest,
    learnLatest,
    featuredVideo,
    sidebarTweets,
    trendingPosts,
    glossaryTerms,
  ] = await Promise.all([
    getHeroPost(),
    getFeaturedPosts(6),
    getLatestByContentType("news", 4),
    getLatestByContentType("article", 3),
    getLatestByContentType("learn", 4),
    getFeaturedVideo(),
    getSidebarTweets(8),
    getTrendingPosts(5),
    getGlossaryTerms(),
  ]);

  return (
    <div>
      <ScrollProgress />
      <AnimatedHero post={heroPost} glossaryTerms={glossaryTerms.map((t) => t.term)} />
      {/* Page content scrolls over the fixed hero */}
      <ParallaxContent>
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <CategoryShowcase news={newsLatest} articles={articlesLatest} learn={learnLatest} />
        </ScrollReveal>
        {trendingPosts.length > 0 && (
          <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
            <TrendingArticles posts={trendingPosts} />
          </ScrollReveal>
        )}
        <ScrollReveal direction="up" scale blur duration={0.8}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <FlippeningTracker />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <FeaturedCarousel posts={featuredPosts} />
        </ScrollReveal>
        <ScrollReveal direction="up" blur duration={0.7}>
          <VideoSpotlight video={featuredVideo} />
        </ScrollReveal>
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <CommunityPulse tweets={sidebarTweets} />
        </ScrollReveal>
        <ScrollReveal direction="up" blur duration={0.8}>
          <AnimatedNewsletterCTA />
        </ScrollReveal>
      </ParallaxContent>
    </div>
  );
}
