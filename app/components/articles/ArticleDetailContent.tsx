import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedArticle } from "@/lib/content/generated/types";
import ArticleHeader from "./ArticleHeader";
import RelatedArticles from "./RelatedArticles";
import styles from "./ArticleDetailContent.module.css";

interface ArticleDetailContentProps {
  article: ProcessedArticle;
  relatedArticles?: ProcessedArticle[];
  locale?: string;
  variant?: "authenticated" | "unauthenticated";
}

export default function ArticleDetailContent({
  article,
  relatedArticles = [],
  locale = "en"
}: ArticleDetailContentProps) {
  const hasRelatedArticles = relatedArticles.length > 0;

  return (
    <div className={styles.mainContent}>
      <ArticleHeader article={article} />
      <div className={hasRelatedArticles ? styles.contentWrapper : styles.contentWrapperFull}>
        <article className={styles.articleContent}>
          <MarkdownContent content={article.content} />
        </article>
        {hasRelatedArticles && (
          <aside className={styles.rightPanel}>
            <RelatedArticles articles={relatedArticles} locale={locale} />
          </aside>
        )}
      </div>
    </div>
  );
}
