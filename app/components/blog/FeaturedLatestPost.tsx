import Link from "next/link";
import { localePath } from "@/lib/i18n/routes";
import type { BlogPostMeta } from "@/lib/content/types";
import { formatBlogDate } from "@/lib/utils";
import AuthorAvatar from "@/components/ui/AuthorAvatar";
import CalendarIcon from "@/icons/calendar.svg";
import styles from "./FeaturedLatestPost.module.css";

interface FeaturedLatestPostProps {
  post: BlogPostMeta;
  locale: string;
}

export default function FeaturedLatestPost({ post, locale }: FeaturedLatestPostProps) {
  const postUrl = localePath(`/blog/${post.slug}`, locale);

  return (
    <Link href={postUrl} className={styles.featuredLatestPost}>
      <div
        className={styles.featuredLatestImage}
        style={post.coverImage ? { backgroundImage: `url(${post.coverImage})` } : undefined}
      />
      <div className={styles.featuredLatestContent}>
        <div className={styles.featuredLatestMetaRow}>
          <div className={styles.featuredLatestLabel}>Latest Post</div>
          <span className={styles.featuredLatestDate}>
            <CalendarIcon />
            {formatBlogDate(post.date)}
          </span>
          <span className={styles.featuredLatestAuthor}>
            <AuthorAvatar author={post.author} size={18} />
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
