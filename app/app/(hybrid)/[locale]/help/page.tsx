import ArticlesPage from "@/components/articles/ArticlesPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.help" });

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function AuthenticatedLocaleArticlesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tag, page } = await searchParams;

  // The default locale is served here under the naked URL (/help), rewritten
  // to /en/help by middleware; an explicit /en/help is redirected back there.
  // Check if locale is supported and has articles
  const locales = getAvailableLocales("articles", SUPPORTED_LOCALES);
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <AuthenticatedHeaderLayout>
      <ArticlesPage authenticated locale={locale} tag={tag} page={page} />
    </AuthenticatedHeaderLayout>
  );
}
