import { getArticle, getAllArticles, getRelatedArticles } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { LoggedOutSignupCta } from "@/components/ui/SignupCta/LoggedOutSignupCta";
import ArticleDetailContent from "./ArticleDetailContent";

interface ArticleDetailPageProps {
  slug: string;
  locale: string;
}

// Helper for generateMetadata
export async function getArticleMetadata(slug: string, locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.help" });
  try {
    const allArticles = await getAllArticles(locale);
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

export default async function ArticleDetailPage({ slug, locale }: ArticleDetailPageProps) {
  let article;
  try {
    article = await getArticle(slug, locale);
  } catch {
    notFound();
  }

  // Get related articles based on tag overlap
  const allArticles = await getAllArticles(locale);
  const relatedArticles = getRelatedArticles(slug, allArticles, 3);

  return (
    <>
      <ArticleDetailContent article={article} relatedArticles={relatedArticles} locale={locale} />

      <LoggedOutSignupCta />
    </>
  );
}
