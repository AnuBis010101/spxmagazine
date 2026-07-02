"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import GoldParticles from "@/components/animations/GoldParticles";
import MagneticHover from "@/components/animations/MagneticHover";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function AnimatedNewsletterCTA() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: trimmed });

      if (error) {
        if (error.code === "23505") {
          toast.error("You're already subscribed!");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        return;
      }

      toast.success("You're subscribed! Welcome aboard.");
      setEmail("");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

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
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Stay in the <span className="text-gold-static">Loop</span>
          </h2>
          <p className="text-mag-muted mt-3">
            Get the latest SPX6900 news and insights delivered to your inbox.
          </p>
        </ScrollReveal>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 flex gap-3 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <MagneticHover strength={0.15} className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full h-12 px-4 bg-mag-dark border border-mag-border rounded-lg text-white placeholder:text-mag-muted focus:border-gold-400 outline-none transition-colors"
            />
          </MagneticHover>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="relative bg-gold-400 text-mag-black px-6 h-12 rounded-lg font-semibold hover:bg-gold-500 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? "..." : "Subscribe"}

            {/* Success particle burst */}
            {isSuccess && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-gold-300"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: Math.cos((i * Math.PI * 2) / 8) * 40,
                      y: Math.sin((i * Math.PI * 2) / 8) * 40,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                ))}
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
