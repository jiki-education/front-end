import ArticlesPage from "@/components/articles/ArticlesPage";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@jiki/content";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamic = "force-static";

export function generateStaticParams() {
  const locales = getAvailableLocales("articles", SUPPORTED_LOCALES);
  return locales.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export default async function LocaleArticlesPage({ params }: Props) {
  const { locale } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect("/articles");
  }

  // Check if locale is supported and has articles
  const locales = getAvailableLocales("articles", SUPPORTED_LOCALES);
  if (!locales.includes(locale)) {
    notFound();
  }

  return <ArticlesPage authenticated={false} locale={locale} />;
}
