import Link from "next/link";
import type { BlogPostMeta } from "@/lib/content/types";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./LatestNewsCard.module.css";

/**
 * The landing page's own blog card: cover image, title, excerpt.
 *
 * Deliberately not the shared BlogPostCard, which also carries a date, a tag badge and
 * an author byline. This surface shows none of those, and threading a scoped stylesheet
 * into the shared component to hide three of its six parts is worse than a small card
 * of its own.
 */
export function LatestNewsCard({ post }: { post: BlogPostMeta }) {
  const routes = useLocaleRoutes();

  return (
    <Link href={routes.blogPost(post.slug)} className={styles.card}>
      <div
        className={styles.image}
        style={post.coverImage ? { backgroundImage: `url(${post.coverImage})` } : undefined}
      />
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
    </Link>
  );
}
