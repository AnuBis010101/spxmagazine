import Link from "next/link";
import type { Post, EmbeddedTweet } from "@/types/content";
import ArticleCard from "@/components/content/ArticleCard";
import TweetEmbed from "@/components/content/TweetEmbed";

interface LatestNewsProps {
  posts: Post[];
  tweets: EmbeddedTweet[];
}

export default function LatestNews({ posts, tweets }: LatestNewsProps) {
  return (
    <section className="py-16 md:py-24 bg-mag-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left column - Latest articles */}
          <div className="lg:col-span-2">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Latest
              </h2>
              <div className="w-16 h-0.5 bg-gold-400 mt-3" />
            </div>

            <div className="flex flex-col gap-6 mt-8">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length > 0 && (
              <div className="mt-8">
                <Link
                  href="/news"
                  className="text-gold-400 font-medium hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Right column - Community tweets */}
          <div className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                  From the Community
                </h2>
                <div className="w-16 h-0.5 bg-gold-400 mt-3" />
              </div>

              <div className="mt-8 flex flex-col gap-4">
                {tweets.length > 0 ? (
                  tweets.map((tweet) => (
                    <TweetEmbed key={tweet.id} tweetUrl={tweet.tweet_url} tweetId={tweet.tweet_id} />
                  ))
                ) : (
                  <div className="rounded-xl bg-mag-dark border border-mag-border p-6 text-center">
                    <p className="text-mag-muted text-sm">
                      Join the conversation on X
                    </p>
                    <a
                      href="https://x.com/SPX6900"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 bg-gold-400 text-mag-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-gold-500 transition"
                    >
                      Follow us on X
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
