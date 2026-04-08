import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import BookmarksList from "@/components/content/BookmarksList";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const metadata: Metadata = {
  title: `Your Reading List | ${SITE_NAME}`,
  description: "Your saved articles and bookmarked content on SPX Magazine.",
};

export default function BookmarksPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <ScrollReveal direction="up" blur duration={0.6}>
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Your Reading List
          </h1>
          <div className="w-16 h-0.5 bg-gold-400 mt-3" />
          <p className="text-mag-muted text-sm mt-3">
            Articles you have bookmarked for later reading.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
        <BookmarksList />
      </ScrollReveal>
    </section>
  );
}
