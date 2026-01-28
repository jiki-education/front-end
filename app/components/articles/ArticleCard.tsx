import Link from "next/link";
import type { ProcessedArticle } from "@/lib/content/generated/types";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: ProcessedArticle;
  locale: string;
}

export default function ArticleCard({ article, locale }: ArticleCardProps) {
  const articleUrl = locale === "en" ? `/articles/${article.slug}` : `/${locale}/articles/${article.slug}`;
  const primaryTag = article.tags[0];

  return (
    <Link href={articleUrl} className={styles.articleCard}>
      <div className={styles.articleMeta}>
        {primaryTag && <span className={styles.articleBadge}>{primaryTag}</span>}
      </div>
      <h2 className={styles.articleTitle}>{article.title}</h2>
      <p className={styles.articleExcerpt}>{article.excerpt}</p>
    </Link>
  );
}
