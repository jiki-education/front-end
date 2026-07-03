import Link from "next/link";
import { localePath } from "@/lib/i18n/routes";
import type { ArticleMeta } from "@/lib/content/types";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: ArticleMeta;
  locale: string;
  compact?: boolean;
}

export default function ArticleCard({ article, locale, compact = false }: ArticleCardProps) {
  const articleUrl = localePath(`/articles/${article.slug}`, locale);
  const firstTag = article.tags[0];

  return (
    <Link href={articleUrl} className={`${styles.articleCard} ${compact ? styles.compact : ""}`}>
      {firstTag && (
        <div className={styles.articleCardMeta}>
          <span className={styles.articleCardBadge}>{firstTag}</span>
        </div>
      )}
      <h4 className={styles.articleCardTitle}>{article.title}</h4>
      <p className={styles.articleCardExcerpt}>{article.excerpt}</p>
    </Link>
  );
}
