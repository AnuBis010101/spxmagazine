import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { getAllAuthors } from "@/lib/authors";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const metadata: Metadata = {
  title: `Authors | ${SITE_NAME}`,
  description:
    "Meet the writers and contributors behind SPX Magazine.",
};

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <ScrollReveal direction="up" blur duration={0.6}>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              Authors
            </h1>
            <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            <p className="text-mag-muted mt-4 text-lg">
              Meet the writers and contributors behind SPX Magazine
            </p>
          </div>
        </ScrollReveal>

        {/* Authors grid */}
        <ScrollReveal direction="up" scale blur duration={0.7} delay={0.1}>
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <Link
              key={author.slug}
              href={`/authors/${author.slug}`}
              className="group rounded-xl bg-mag-dark border border-mag-border hover:border-gold-400/40 transition-all duration-300 p-6 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)]"
            >
              {/* Avatar */}
              {author.avatar ? (
                <div className="w-20 h-20 rounded-full overflow-hidden relative ring-2 ring-gold-400/50">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-400/5 border-2 border-gold-400/50 flex items-center justify-center">
                  <span className="text-gold-400 font-display font-bold text-2xl">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <h2 className="font-display font-bold text-lg text-white mt-4 group-hover:text-gold-400 transition-colors">
                {author.name}
              </h2>
              <p className="text-gold-400/80 text-sm font-body mt-1">
                {author.role}
              </p>
              <p className="text-mag-muted text-sm font-body mt-2 line-clamp-2">
                {author.bio}
              </p>
            </Link>
          ))}
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
