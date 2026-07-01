import { ArrowRight, Mail } from "lucide-react";
import { NEWSLETTER_SIGNUP_URL } from "@/lib/constants";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * Prominent newsletter band at the top of the homepage content. Unlike the
 * inline Supabase form (AnimatedNewsletterCTA), this is a call-to-action that
 * links out to the client's external signup page.
 */
export default function NewsletterBanner() {
  return (
    <ScrollReveal direction="up" blur duration={0.6}>
      <section className="border-y border-gold-400/20 bg-gradient-to-b from-gold-400/[0.06] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:text-left">
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 sm:flex">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  SPX news in your inbox{" "}
                  <span className="text-gold-gradient">every week</span>
                </h2>
                <p className="mt-2 text-mag-muted text-sm md:text-base">
                  The stories, data, and lore driving SPX6900 — straight to you.
                </p>
              </div>
            </div>

            <a
              href={NEWSLETTER_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-gold-400 px-7 text-base font-semibold text-mag-black transition-all duration-200 hover:bg-gold-500 hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] w-full sm:w-auto"
            >
              Subscribe
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
