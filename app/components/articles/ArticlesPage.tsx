import { getArticles, ARTICLE_TAG_SLUGS, type ArticleTagSlug } from "@/lib/content";
import ArticlesContent from "./ArticlesContent";

interface ArticlesPageProps {
  authenticated: boolean;
  locale: string;
  tag?: string | null;
  page?: string | null;
}

export default async function ArticlesPage({ authenticated: _, locale, tag, page }: ArticlesPageProps) {
  // Validate tag param
  const validTag = tag && ARTICLE_TAG_SLUGS.includes(tag as ArticleTagSlug) ? (tag as ArticleTagSlug) : null;

  // Parse page param
  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;

  const { articles, totalPages, currentPage } = await getArticles({
    locale,
    tag: validTag,
    page: pageNum
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-text-primary">Articles</h1>
        <p className="text-lg text-text-secondary">In-depth guides and tutorials for learning to code</p>
      </header>
      <ArticlesContent
        articles={articles}
        locale={locale}
        selectedTag={validTag}
        currentPage={currentPage}
        totalPages={totalPages}
        tagSlugs={ARTICLE_TAG_SLUGS}
      />
    </div>
  );
}
