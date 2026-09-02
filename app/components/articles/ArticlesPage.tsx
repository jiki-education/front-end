import { getTranslations } from "next-intl/server";
import { getArticles, ARTICLE_TAG_SLUGS, type ArticleTagSlug } from "@/lib/content";
import PageHeader from "@/components/blog/PageHeader";
import ArticlesContent from "./ArticlesContent";
import { LoggedOutSignupCta } from "@/components/ui/SignupCta/LoggedOutSignupCta";
import styles from "./ArticlesPage.module.css";

interface ArticlesPageProps {
  locale: string;
  tag?: string | null;
  page?: string | null;
}

export default async function ArticlesPage({ locale, tag, page }: ArticlesPageProps) {
  // getTranslations, not useTranslations: this is an async server component now,
  // because the article list it renders is fetched rather than bundled.
  const t = await getTranslations("articles.header");
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
      <div className={styles.pageContent}>
        <PageHeader label={t("label")} title={t("title")} subtitle={t("subtitle")} />
        <ArticlesContent
          articles={articles}
          locale={locale}
          selectedTag={validTag}
          currentPage={currentPage}
          totalPages={totalPages}
          tagSlugs={ARTICLE_TAG_SLUGS}
        />
      </div>

      {/* Outside the padded container so the band bleeds to the viewport edges. */}
      <LoggedOutSignupCta />
    </div>
  );
}
