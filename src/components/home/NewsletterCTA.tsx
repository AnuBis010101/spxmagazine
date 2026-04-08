"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    // Basic email validation
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
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden border-t border-gold-400/20 border-b border-b-gold-400/20">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="font-display text-3xl font-bold text-white">
          Stay in the Loop
        </h2>
        <p className="text-mag-muted mt-3">
          Get the latest SPX6900 news and insights delivered to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 h-12 px-4 bg-mag-dark border border-mag-border rounded-lg text-white placeholder:text-mag-muted focus:border-gold-400 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gold-400 text-mag-black px-6 h-12 rounded-lg font-semibold hover:bg-gold-500 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
