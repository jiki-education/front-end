import type { ProcessedArticle } from "@/lib/content/types";
import { formatBlogDate } from "@/lib/utils";
import AuthorIcon from "@/icons/author.svg";
import CalendarIcon from "@/icons/calendar.svg";
import ClockIcon from "@/icons/clock.svg";
import styles from "./ArticleHeader.module.css";

interface ArticleHeaderProps {
  article: ProcessedArticle;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className={styles.articleHeader}>
      <div className={styles.articleHeaderContent}>
        <h1 className={styles.articleTitle}>{article.title}</h1>
        <p className={styles.articleSubtitle}>{article.excerpt}</p>
        <div className={styles.articleMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <CalendarIcon />
            </span>
            <span>{formatBlogDate(article.date)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <AuthorIcon />
            </span>
            <span>Written by {article.author.name}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <ClockIcon />
            </span>
            <span>{article.readingTime} minute read</span>
          </div>
        </div>
      </div>
    </header>
  );
}
