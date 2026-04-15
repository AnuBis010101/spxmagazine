import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import FlippeningTracker from "@/components/widgets/FlippeningTracker";
import HoldersTracker from "@/components/widgets/HoldersTracker";
import CounterCulture from "@/components/widgets/CounterCulture";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const metadata: Metadata = {
  title: `SPX6900 Data | ${SITE_NAME}`,
  description:
    "Track SPX6900's progress toward flipping the S&P 500 total market cap. View holder counts across Ethereum, Solana, and Base. Live data and analytics.",
};

export default function DataPage() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              SPX6900 Data
            </h1>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            <p className="text-mag-muted mt-4 text-lg max-w-2xl">
              Real-time metrics tracking SPX6900&apos;s progress across multiple
              blockchains and market indicators.
            </p>
          </div>
        </ScrollReveal>

        {/* Flippening Tracker */}
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <div className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
              The Flippening Tracker
            </h2>
            <FlippeningTracker />
          </div>
        </ScrollReveal>

        {/* Holder Information */}
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <div className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8">
              Holder Distribution
            </h2>
            <p className="text-mag-muted mb-8 max-w-2xl">
              Track SPX6900 holders across all supported blockchains. Data is
              updated regularly to reflect current distribution.
            </p>
            <HoldersTracker />
          </div>
        </ScrollReveal>

        {/* State of the World — counter-culture metrics */}
        <ScrollReveal direction="up" scale blur duration={0.7}>
          <div className="mt-20">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
              State of the World
            </h2>
            <div className="w-16 h-0.5 bg-gold-400 mt-3 mb-6" />
            <p className="text-mag-muted mb-10 max-w-3xl text-lg">
              Why the movement matters. Indicators of a society in crisis:
              loneliness, doomerism, nihilism, AI anxiety, collapsing trust,
              and deaths of despair. Sourced from published reports,
              refreshed monthly.
            </p>
            <CounterCulture />
          </div>
        </ScrollReveal>

        {/* Explanation section */}
        <ScrollReveal direction="up" scale blur duration={0.7}>
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-mag-dark border border-mag-border p-6 md:p-8">
            <h3 className="font-display text-xl md:text-2xl font-bold text-white">
              What is the Flippening?
            </h3>
            <div className="w-12 h-0.5 bg-gold-400 mt-3" />
            <div className="mt-4 space-y-4 font-body text-mag-muted leading-relaxed">
              <p>
                The Flippening refers to the moment SPX6900&apos;s total market
                capitalization surpasses that of the entire S&P 500 index --
                currently valued at approximately $50 trillion.
              </p>
              <p>
                While an ambitious target, the SPX6900 community tracks this
                metric as a long-term aspirational goal and a measure of the
                token&apos;s growth trajectory relative to traditional finance.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-mag-dark border border-mag-border p-6 md:p-8">
            <h3 className="font-display text-xl md:text-2xl font-bold text-white">
              Multi-Chain Distribution
            </h3>
            <div className="w-12 h-0.5 bg-gold-400 mt-3" />
            <div className="mt-4 space-y-4 font-body text-mag-muted leading-relaxed">
              <p>
                SPX6900 is deployed across three major blockchains: Ethereum,
                Solana, and Base. Each chain hosts its own token contract and
                holder community.
              </p>
              <p>
                Check the holder distribution above to understand token spread
                across networks. Click any chain card to view full details on
                the respective block explorer.
              </p>
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" blur duration={0.7}>
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl bg-[rgba(20,20,20,0.6)] backdrop-blur-xl border border-gold-400/20 p-8 md:p-10">
            <h3 className="font-display text-xl md:text-2xl font-bold bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent">
              Stay Informed
            </h3>
            <p className="text-mag-muted mt-3 max-w-md mx-auto font-body">
              Read the latest analysis and community insights about SPX6900 and
              its path forward.
            </p>
            <a
              href="/articles"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-mag-black font-display font-semibold hover:bg-gold-300 transition-colors"
            >
              Browse Articles
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
