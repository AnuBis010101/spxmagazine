import type { Post } from "@/types/content";
import ArticleCard from "@/components/content/ArticleCard";

interface FeaturedGridProps {
  posts: Post[];
}

export default function FeaturedGrid({ posts }: FeaturedGridProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Featured Stories
          </h2>
          <div className="w-16 h-0.5 bg-gold-400 mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
