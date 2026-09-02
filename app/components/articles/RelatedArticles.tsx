import { useTranslations } from "next-intl";
import type { ArticleMeta } from "@/lib/content/types";
import ArticleCard from "./ArticleCard";
import { SidebarSection } from "@/components/ui/SidebarSection/SidebarSection";
import styles from "./RelatedArticles.module.css";

interface RelatedArticlesProps {
  articles: ArticleMeta[];
  locale: string;
}

export default function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  const t = useTranslations("articles.relatedArticles");
  if (articles.length === 0) {
    return null;
  }

  return (
    <SidebarSection heading={t("heading")}>
      <div className={styles.relatedArticlesSection}>
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale={locale} compact />
        ))}
      </div>
    </SidebarSection>
  );
}
