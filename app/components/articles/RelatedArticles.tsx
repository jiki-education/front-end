import type { ArticleMeta } from "@/lib/content/types";
import ArticleCard from "./ArticleCard";
import styles from "./RelatedArticles.module.css";

interface RelatedArticlesProps {
  articles: ArticleMeta[];
  locale: string;
}

export default function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className={styles.relatedArticlesTitle}>Related Articles</h3>
      <div className={styles.relatedArticlesSection}>
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale={locale} />
        ))}
      </div>
    </div>
  );
}
