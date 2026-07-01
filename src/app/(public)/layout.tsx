import { MotionConfig } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { NewsTicker } from "@/components/layout/NewsTicker";
import NewsletterStickyBar from "@/components/layout/NewsletterStickyBar";
import PageTransition from "@/components/animations/PageTransition";
import OrbitBackground from "@/components/home/OrbitBackground";
import { createClient } from "@/lib/supabase/server";
import { getLatestPosts } from "@/lib/queries/articles";
import { getGlossaryTerms } from "@/lib/queries/glossary";

async function getAnnouncement(): Promise<{ message: string; link?: string; linkText?: string } | null> {
  try {
    const supabase = await createClient();
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

  const newsPosts = tickerPosts.filter((p) => p.content_type === "news");
  const termsList = glossaryTerms.map((t) => t.term);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {/* Fixed orbit animation — always visible behind all content */}
      <OrbitBackground glossaryTerms={termsList} />
      {announcement && (
        <AnnouncementBar
          message={announcement.message}
          link={announcement.link}
          linkText={announcement.linkText}
        />
      )}
      <Header />
      {newsPosts.length > 0 && <NewsTicker posts={newsPosts} />}
      <NewsletterStickyBar />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
    </MotionConfig>
  );
}
