import { useTranslations } from "next-intl";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/content/types";
import { formatBlogDate } from "@/lib/utils";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import AuthorAvatar from "@/components/ui/AuthorAvatar";
import styles from "./LatestNewsSection.module.css";

interface LatestNewsSectionProps {
  posts: BlogPostMeta[];
}

export function LatestNewsSection({ posts }: LatestNewsSectionProps) {
  const t = useTranslations("landing.latestNews");
  const routes = useLocaleRoutes();
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t("heading")}</h2>
        <p className={styles.subheading}>
          {t("subheadingPrefix")}
          <Link href={routes.blog()} className={styles.blogLink}>
            {t("subheadingLink")}
          </Link>
          .
        </p>
        <div className={styles.grid}>
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPostCard({ post }: { post: BlogPostMeta }) {
  const t = useTranslations("landing.latestNews");
  const routes = useLocaleRoutes();
  return (
    <Link href={routes.blogPost(post.slug)} className={styles.blogPostCard}>
      <div
        className={styles.postImage}
        style={post.coverImage ? { backgroundImage: `url(${post.coverImage})` } : undefined}
      />
      <div className={styles.postMeta}>
        <span className={styles.postDate}>{formatBlogDate(post.date)}</span>
        {post.tags[0] && <span className={styles.postBadge}>{post.tags[0]}</span>}
      </div>
      <h3 className={styles.postTitle}>{post.title}</h3>
      <p className={styles.postExcerpt}>{post.excerpt}</p>
      <div className={styles.postAuthor}>
        <AuthorAvatar author={post.author} />
        <span>{t("byAuthor", { name: post.author.name })}</span>
      </div>
    </Link>
  );
}
