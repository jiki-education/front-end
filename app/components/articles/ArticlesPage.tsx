import { getArticles, ARTICLE_TAG_SLUGS, type ArticleTagSlug } from "@/lib/content";
import PageHeader from "@/components/blog/PageHeader";
import ArticlesContent from "./ArticlesContent";
import styles from "./ArticlesPage.module.css";

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
    <div className={styles.pageWrapper}>
      <div className="p-40">
        <PageHeader
          label="Articles"
          title="Help and resources"
          subtitle="Guides, tutorials, and answers to help you get the most out of Jiki."
        />
        <ArticlesContent
          articles={articles}
          locale={locale}
          selectedTag={validTag}
          currentPage={currentPage}
          totalPages={totalPages}
          tagSlugs={ARTICLE_TAG_SLUGS}
        />
      </div>
    </div>
  );
}
