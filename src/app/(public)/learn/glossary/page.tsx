import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { buildOgImageUrl } from "@/lib/utils/og-url";
import { getGlossaryTerms } from "@/lib/queries/glossary";
import GlossarySearch from "@/components/content/GlossarySearch";
import ScrollReveal from "@/components/animations/ScrollReveal";

export function generateMetadata(): Metadata {
  return {
    title: `SPX6900 Glossary`,
    description:
      "Your guide to the movement's terminology. Explore key terms, concepts, and lore from the SPX6900 community.",
    openGraph: {
      images: [{ url: buildOgImageUrl({ title: "SPX6900 Glossary", subtitle: "Your guide to the movement's terminology" }), width: 1200, height: 630 }],
    },
  };
}

export const revalidate = 60;

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();

  const jsonLd =
    terms.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "SPX6900 Glossary",
          url: `${SITE_URL}/learn/glossary`,
          hasDefinedTerm: terms.map((t) => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.definition,
            url: `${SITE_URL}/learn/glossary#${t.slug}`,
          })),
        }
      : null;

  return (
    <section className="py-12 md:py-20">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400/70 mb-4">
              <span className="w-8 h-px bg-gold-400/30" />
              The SPX6900 Wiki
              <span className="w-8 h-px bg-gold-400/30" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
              Glossary of{" "}
              <span className="bg-gradient-to-r from-gold-400 via-yellow-300 to-gold-400 bg-clip-text text-transparent">
                Expressions
              </span>
            </h1>
            <p className="text-mag-muted mt-5 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              The complete guide to SPX6900 lore, expressions, and community terminology.
            </p>
          </div>
        </ScrollReveal>

        {/* Terms */}
        {terms.length > 0 ? (
          <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
            <GlossarySearch terms={terms} />
          </ScrollReveal>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-mag-muted text-lg">
              Glossary coming soon. Check back for a full guide to SPX6900
              terminology.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
