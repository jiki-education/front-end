import { useTranslations } from "next-intl";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/content/types";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import BlogPostCard from "@/components/blog/BlogPostCard";
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
          {t.rich("subheading", {
            link: (chunks) => (
              <Link href={routes.blog()} className={styles.blogLink}>
                {chunks}
              </Link>
            )
          })}
        </p>
        <div className={styles.grid}>
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} styles={styles} headingLevel="h3" />
          ))}
        </div>
      </div>
    </section>
  );
}
