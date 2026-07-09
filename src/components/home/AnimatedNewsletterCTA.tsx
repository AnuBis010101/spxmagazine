"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GoldParticles from "@/components/animations/GoldParticles";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Newsletter section. Signup is handled by Substack's official inline embed so
 * a visitor is subscribed to the real newsletter in-place — no new tab, no
 * re-typing their email elsewhere. (Substack blocks server/browser API
 * subscribes behind Cloudflare, so the embed is the only seamless path.)
 */
export default function AnimatedNewsletterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className="scroll-mt-24 py-16 md:py-24 relative overflow-hidden border-t border-gold-400/20"
    >
      {/* Subtle gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold-400/[0.03] via-transparent to-gold-400/[0.03]" />

      {/* Floating particles */}
      <GoldParticles count={15} />

      {/* Self-drawing gold lines */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gold-400"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gold-400"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <ScrollReveal>
          <SectionHeading
            folio="06"
            align="center"
            eyebrow="Newsletter"
            title={<>Stay in the <span className="text-gold-static">Loop</span></>}
            standfirst="Get the latest SPX6900 news and insights delivered to your inbox. One click — no new tabs, no forms to re-fill."
          />
        </ScrollReveal>

        {/* Substack's official embed: subscribes on the newsletter directly,
            in-page. Framed as a clean card so the widget sits intentionally
            inside the dark/gold section. */}
        <motion.div
          className="mx-auto mt-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="overflow-hidden rounded-2xl border border-gold-400/40 bg-white/95 shadow-[0_12px_40px_-16px_rgba(212,175,55,0.35)] ring-1 ring-black/5">
            <iframe
              src="https://spx6900magazine.substack.com/embed"
              title="Subscribe to SPX Magazine on Substack"
              width="100%"
              height="150"
              loading="lazy"
              scrolling="no"
              className="block w-full"
              style={{ border: 0, background: "transparent" }}
            />
          </div>
          <p className="mt-3 text-xs text-mag-muted">
            Powered by Substack · unsubscribe anytime · no spam.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
