import type { BlogPostMeta } from "@/lib/content/types";
import BlogPostCard from "./BlogPostCard";
import styles from "./BlogPostCard.module.css";

interface BlogPostsGridProps {
  posts: BlogPostMeta[];
}

export default function BlogPostsGrid({ posts }: BlogPostsGridProps) {
  return (
    <div className={styles.blogPostsGrid}>
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} styles={styles} headingLevel="h2" />
      ))}
    </div>
  );
}
