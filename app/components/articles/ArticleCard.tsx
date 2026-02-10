import Link from "next/link";
import type { ProcessedArticle } from "@/lib/content/generated/types";
import { formatBlogDate } from "@/lib/utils";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: ProcessedArticle;
  locale: string;
}

export default function ArticleCard({ article, locale }: ArticleCardProps) {
  const articleUrl = locale === "en" ? `/articles/${article.slug}` : `/${locale}/articles/${article.slug}`;
  const firstTag = article.tags[0];

  return (
    <Link href={articleUrl} className={styles.articleCard}>
      <div className={styles.articleCardImage} />
      <div className={styles.articleCardMeta}>
        <span className={styles.articleCardDate}>{formatBlogDate(article.date)}</span>
        {firstTag && <span className={styles.articleCardBadge}>{firstTag}</span>}
      </div>
      <h4 className={styles.articleCardTitle}>{article.title}</h4>
      <p className={styles.articleCardExcerpt}>{article.excerpt}</p>
    </Link>
  );
}
