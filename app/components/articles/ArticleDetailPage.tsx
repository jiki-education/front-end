import { getArticle, getAllArticles, getRelatedArticles } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import CTABlock from "../blog/CTABlock";
import ArticleDetailContent from "./ArticleDetailContent";

interface ArticleDetailPageProps {
  slug: string;
  authenticated: boolean;
  locale: string;
}

// Helper for generateMetadata
export async function getArticleMetadata(slug: string, locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.help" });
  try {
    const allArticles = getAllArticles(locale);
    const article = allArticles.find((a) => a.slug === slug);
    if (!article) {
      return { title: t("notFound") };
    }

    return {
      title: article.title,
      description: article.seo.description,
      keywords: article.seo.keywords.join(", ")
    };
  } catch {
    return { title: t("notFound") };
  }
}

export default async function ArticleDetailPage({ slug, authenticated, locale }: ArticleDetailPageProps) {
  const t = await getTranslations({ locale, namespace: "articles.cta" });
  let article;
  try {
    article = await getArticle(slug, locale);
  } catch {
    notFound();
  }

  // Get related articles based on tag overlap
  const allArticles = getAllArticles(locale);
  const relatedArticles = getRelatedArticles(slug, allArticles, 3);

  if (authenticated) {
    return <ArticleDetailContent article={article} relatedArticles={relatedArticles} locale={locale} />;
  }

  return (
    <>
      <ArticleDetailContent article={article} relatedArticles={relatedArticles} locale={locale} />

      {/* Minimal CTA */}
      <CTABlock
        variant="minimal"
        title={t("minimalTitle")}
        subtitle={t("minimalSubtitle")}
        buttonText={t("minimalButton")}
        buttonHref="/signup"
      />

      {/* Gradient CTA */}
      <CTABlock
        variant="gradient"
        title={t("gradientTitle")}
        subtitle={t("gradientSubtitle")}
        buttonText={t("gradientButton")}
        buttonHref="/signup"
      />
    </>
  );
}
