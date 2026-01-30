import type { ProcessedArticle } from "@/lib/content/generated/types";
import ArticleCard from "./ArticleCard";

interface RelatedArticlesProps {
  articles: ProcessedArticle[];
  locale: string;
}

export default function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Related Articles</h2>
      <div>
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale={locale} />
        ))}
      </div>
    </div>
  );
}
