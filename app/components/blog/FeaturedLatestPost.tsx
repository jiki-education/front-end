import Link from "next/link";
import type { ProcessedBlogPost } from "@/lib/content/generated/types";
import { formatBlogDate } from "@/lib/utils";
import AuthorIcon from "@/icons/author.svg";
import CalendarIcon from "@/icons/calendar.svg";
import styles from "./FeaturedLatestPost.module.css";

interface FeaturedLatestPostProps {
  post: ProcessedBlogPost;
  locale: string;
}

export default function FeaturedLatestPost({ post, locale }: FeaturedLatestPostProps) {
  const postUrl = locale === "en" ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`;

  return (
    <Link href={postUrl} className={styles.featuredLatestPost}>
      <div className={styles.featuredLatestImage} />
      <div className={styles.featuredLatestContent}>
        <div className={styles.featuredLatestMetaRow}>
          <div className={styles.featuredLatestLabel}>Latest Post</div>
          <span className={styles.featuredLatestDate}>
            <CalendarIcon />
            {formatBlogDate(post.date)}
          </span>
          <span className={styles.featuredLatestAuthor}>
            <AuthorIcon />
            by {post.author.name}
          </span>
        </div>
        <h2 className={styles.featuredLatestTitle}>{post.title}</h2>
        <p className={styles.featuredLatestExcerpt}>{post.excerpt}</p>
        <span className={styles.featuredLatestLink}>Read full article →</span>
      </div>
    </Link>
  );
}
