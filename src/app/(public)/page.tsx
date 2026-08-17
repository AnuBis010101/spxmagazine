import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { getHeroPost, getFeaturedPosts, getLatestByContentType, getLatestCommunityArticles, getTrendingPosts } from "@/lib/queries/articles";
import { getFeaturedVideo } from "@/lib/queries/videos";
import { getSidebarTweets } from "@/lib/queries/tweets";
import { getGlossaryTerms } from "@/lib/queries/glossary";
import ScrollProgress from "@/components/home/ScrollProgress";
import OrbitCoin from "@/components/home/OrbitCoin";
import AnimatedHero from "@/components/home/AnimatedHero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BeliefMarquee from "@/components/home/BeliefMarquee";
import FilamentDivider from "@/components/home/FilamentDivider";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import VideoSpotlight from "@/components/home/VideoSpotlight";
import CommunityPulse from "@/components/home/CommunityPulse";
import AnimatedNewsletterCTA from "@/components/home/AnimatedNewsletterCTA";
import FlippeningTracker from "@/components/widgets/FlippeningTracker";
import TrendingArticles from "@/components/home/TrendingArticles";
import ScrollReveal from "@/components/animations/ScrollReveal";
import RackFocus from "@/components/animations/RackFocus";
import ParallaxContent from "@/components/home/ParallaxContent";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | The Voice of SPX6900` },
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
    getLatestCommunityArticles(3),
    getLatestByContentType("learn", 4),
    getFeaturedVideo(),
    getSidebarTweets(8),
    getTrendingPosts(5),
    getGlossaryTerms(),
  ]);

  return (
    <div>
      <ScrollProgress />
      <OrbitCoin />
      <AnimatedHero post={heroPost} glossaryTerms={glossaryTerms.map((t) => t.term)} />
      {/* Page content scrolls over the fixed hero */}
      <ParallaxContent>
        {/* First block rack-focuses IN as the hero rack-focuses OUT above it —
            a continuous, scroll-linked focus pull rather than a one-shot reveal. */}
        <RackFocus>
          <CategoryShowcase news={newsLatest} articles={articlesLatest} learn={learnLatest} />
        </RackFocus>
        {/* Scroll-reactive band between Departments and Trending */}
        <BeliefMarquee />
        {trendingPosts.length >= 3 && (
          <ScrollReveal direction="up" duration={0.55}>
            <TrendingArticles posts={trendingPosts} />
          </ScrollReveal>
        )}
        {/* Scroll-drawn seam between Trending and the market-cap gauge */}
        <FilamentDivider />
        <ScrollReveal direction="up" duration={0.55}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <FlippeningTracker />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="up" duration={0.55}>
          <FeaturedCarousel posts={featuredPosts} />
        </ScrollReveal>
        <ScrollReveal direction="up" duration={0.55}>
          <VideoSpotlight video={featuredVideo} />
        </ScrollReveal>
        <ScrollReveal direction="up" duration={0.55}>
          <CommunityPulse tweets={sidebarTweets} />
        </ScrollReveal>
        <ScrollReveal direction="up" duration={0.55}>
          <AnimatedNewsletterCTA />
        </ScrollReveal>
      </ParallaxContent>
    </div>
  );
}
