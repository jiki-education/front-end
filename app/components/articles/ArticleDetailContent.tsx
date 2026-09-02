import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedArticle, ArticleMeta } from "@/lib/content/types";
import ArticleHeader from "./ArticleHeader";
import RelatedArticles from "./RelatedArticles";
import shared from "@/components/landing-page/shared.module.css";
import styles from "@/components/ui/ContentWithSidebar.module.css";

interface ArticleDetailContentProps {
  article: ProcessedArticle;
  relatedArticles: ArticleMeta[];
  locale: string;
}

export default function ArticleDetailContent({ article, relatedArticles, locale }: ArticleDetailContentProps) {
  return (
    <div className={styles.mainContent}>
      <ArticleHeader article={article} />
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
    </div>
  );
}
