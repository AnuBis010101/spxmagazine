import { MotionConfig } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { NewsTicker } from "@/components/layout/NewsTicker";
import NewsletterStickyBar from "@/components/layout/NewsletterStickyBar";
import EasterEgg from "@/components/layout/EasterEgg";
import AeonAssistant from "@/components/widgets/AeonAssistant";
import PageTransition from "@/components/animations/PageTransition";
import ViewTransitions from "@/components/animations/ViewTransitions";
import OrbitBackground from "@/components/home/OrbitBackground";
import OrbitCoin from "@/components/home/OrbitCoin";
import { createPublicClient } from "@/lib/supabase/public";
import { getLatestPosts } from "@/lib/queries/articles";
import { getGlossaryTerms } from "@/lib/queries/glossary";

async function getAnnouncement(): Promise<{ message: string; link?: string; linkText?: string } | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "announcement")
      .single();
    if (data?.value && typeof data.value === "object") {
      const v = data.value as Record<string, string>;
      if (v.message) return { message: v.message, link: v.link, linkText: v.linkText };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [announcement, tickerPosts, glossaryTerms] = await Promise.all([
    getAnnouncement(),
    getLatestPosts(12),
    getGlossaryTerms(),
  ]);

  const termsList = glossaryTerms.map((t) => t.term);

  return (
    <MotionConfig reducedMotion="user">
      <ViewTransitions />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {/* Fixed orbit animation — always visible behind all content */}
      <OrbitBackground glossaryTerms={termsList} />
      {/* The coin lives here rather than on the homepage so every route gets
          it with identical mechanics: it grows in as the reader scrolls off
          the first screen, glitches under their scroll velocity, and recedes
          when they return to the top. Centred on the same point as the orbit
          above. */}
      <OrbitCoin />
      {announcement && (
        <AnnouncementBar
          message={announcement.message}
          link={announcement.link}
          linkText={announcement.linkText}
        />
      )}
      <Header />
      {tickerPosts.length > 0 && <NewsTicker posts={tickerPosts} />}
      <NewsletterStickyBar />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1"
        data-ticker={tickerPosts.length > 0 ? "true" : "false"}
      >
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
      <EasterEgg />
      <AeonAssistant />
    </MotionConfig>
  );
}
