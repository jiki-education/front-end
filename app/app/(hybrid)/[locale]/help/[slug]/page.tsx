import ArticleDetailPage, { getArticleMetadata } from "@/components/articles/ArticleDetailPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import JsonLd from "@/components/seo/JsonLd";
import { getAllArticles } from "@/lib/content";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getArticleMetadata(slug, locale);
}

export default async function AuthenticatedLocaleArticlePage({ params }: Props) {
  const { locale, slug } = await params;

  const article = getAllArticles(locale).find((a) => a.slug === slug);
  const jsonLd = article
    ? [
        articleSchema({
          type: "Article",
          path: `/help/${slug}`,
          locale,
          headline: article.title,
          description: article.seo.description || article.excerpt,
          datePublished: article.date,
          authorName: article.author.name,
          keywords: article.seo.keywords.length > 0 ? article.seo.keywords : article.tags
        }),
        breadcrumbSchema(
          [
            { name: "Help", path: "/help" },
            { name: article.title, path: `/help/${slug}` }
          ],
          locale
        )
      ]
    : null;

  return (
    <AuthenticatedHeaderLayout>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ArticleDetailPage slug={slug} authenticated={true} locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
