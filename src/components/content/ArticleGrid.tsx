import type { Post } from "@/types/content";
import ArticleCard from "@/components/content/ArticleCard";

interface ArticleGridProps {
  posts: Post[];
  columns?: 2 | 3;
}

export default function ArticleGrid({
  posts,
  columns = 3,
}: ArticleGridProps) {
  return (
    <div
      className={
        columns === 2
          ? "grid gap-6 grid-cols-1 md:grid-cols-2"
          : "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }
    >
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}
