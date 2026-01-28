import type { ProcessedBlogPost } from "@/lib/content/generated/types";
import { formatBlogDate } from "@/lib/utils";
import AuthorIcon from "@/icons/author.svg";
import CalendarIcon from "@/icons/calendar.svg";
import ClockIcon from "@/icons/clock.svg";
import styles from "./BlogPostHeader.module.css";

interface BlogPostHeaderProps {
  post: ProcessedBlogPost;
}

export default function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const readingTime = estimateReadingTime(post.content);

  return (
    <header className={styles.articleHeader}>
      <div className={styles.articleHeaderContent}>
        <h1 className={styles.articleTitle}>{post.title}</h1>
        <p className={styles.articleSubtitle}>{post.excerpt}</p>
        <div className={styles.articleMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <CalendarIcon />
            </span>
            <span>{formatBlogDate(post.date)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <AuthorIcon />
            </span>
            <span>Written by {post.author.name}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <ClockIcon />
            </span>
            <span>{readingTime} minute read</span>
          </div>
        </div>
      </div>
      <div className={styles.articleHeaderImage} />
    </header>
  );
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
