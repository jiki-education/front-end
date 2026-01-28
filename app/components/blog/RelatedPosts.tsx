import Link from "next/link";
import type { ProcessedBlogPost } from "@/lib/content/generated/types";
import { formatBlogDate } from "@/lib/utils";
import styles from "./RelatedPosts.module.css";

interface RelatedPostsProps {
  posts: ProcessedBlogPost[];
  locale: string;
}

export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={styles.relatedPostsContainer}>
      <h3 className={styles.relatedPostsTitle}>Related Posts</h3>
      <div className={styles.relatedPostsSection}>
        {posts.map((post) => (
          <RelatedPostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}

interface RelatedPostCardProps {
  post: ProcessedBlogPost;
  locale: string;
}

function RelatedPostCard({ post, locale }: RelatedPostCardProps) {
  const postUrl = locale === "en" ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`;
  const firstTag = post.tags[0];

  return (
    <Link href={postUrl} className={styles.blogCard}>
      <div className={styles.blogCardImage} />
      <div className={styles.blogCardMeta}>
        <span className={styles.blogCardDate}>{formatBlogDate(post.date)}</span>
        {firstTag && <span className={styles.blogCardBadge}>{firstTag}</span>}
      </div>
      <h4 className={styles.blogCardTitle}>{post.title}</h4>
      <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
    </Link>
  );
}
