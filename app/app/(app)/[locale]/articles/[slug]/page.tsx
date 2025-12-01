import ArticleDetailPage, { getArticleMetadata } from "@/components/articles/ArticleDetailPage";
import AuthenticatedHeaderLayout from "@/components/layout/AuthenticatedHeaderLayout";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAllPostSlugsWithLocales } from "@jiki/content";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllPostSlugsWithLocales("articles", SUPPORTED_LOCALES)
    .filter((p) => p.locale !== DEFAULT_LOCALE)
    .map((p) => ({ locale: p.locale, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (locale === DEFAULT_LOCALE) {
    return { title: "Redirecting..." };
  }

  return getArticleMetadata(slug, locale);
}

export default async function AuthenticatedLocaleArticlePage({ params }: Props) {
  const { locale, slug } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect(`/articles/${slug}`);
  }

  return (
    <AuthenticatedHeaderLayout>
      <ArticleDetailPage slug={slug} authenticated={true} locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
