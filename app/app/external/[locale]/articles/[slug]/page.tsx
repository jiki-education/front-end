import ArticleDetailPage, { getArticleMetadata } from "@/components/articles/ArticleDetailPage";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAllPostSlugsWithLocales } from "@jiki/content";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamic = "force-static";

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

export default async function LocaleArticlePage({ params }: Props) {
  const { locale, slug } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect(`/articles/${slug}`);
  }

  return <ArticleDetailPage slug={slug} authenticated={false} locale={locale} />;
}
