import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedArticle, ArticleMeta } from "@/lib/content/types";
import ArticleHeader from "./ArticleHeader";
import RelatedArticles from "./RelatedArticles";
import shared from "@/components/landing-page/shared.module.css";
import styles from "@/components/ui/ContentWithSidebar.module.css";

interface ArticleDetailContentProps {
  article: ProcessedArticle;
  relatedArticles?: ArticleMeta[];
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
      {hasRelatedArticles ? (
        <div className={styles.contentWrapper}>
          <div className={`${shared["lg-container"]} ${styles.contentWrapperInner}`}>
            <article className={styles.articleContent}>
              <MarkdownContent content={article.content} />
            </article>
            <aside className={styles.rightPanel}>
              <RelatedArticles articles={relatedArticles} locale={locale} />
            </aside>
          </div>
        </div>
      ) : (
        <div className={styles.contentWrapperFull}>
          <div className={`${shared["lg-container"]} ${styles.contentWrapperFullInner}`}>
            <article className={styles.articleContent}>
              <MarkdownContent content={article.content} />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
