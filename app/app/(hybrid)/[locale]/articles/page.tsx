import ArticlesPage from "@/components/articles/ArticlesPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@/lib/content/loader";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  const locales = await getAvailableLocales("articles", SUPPORTED_LOCALES);
  return locales.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Articles - Jiki",
    es: "Artículos - Jiki"
  };

  const descriptions: Record<string, string> = {
    en: "Explore in-depth programming tutorials, guides, and technical articles to level up your coding skills.",
    es: "Explora tutoriales de programación en profundidad, guías y artículos técnicos para mejorar tus habilidades de codificación."
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en
  };
}

export default async function AuthenticatedLocaleArticlesPage({ params }: Props) {
  const { locale } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect("/articles");
  }

  // Check if locale is supported and has articles
  const locales = await getAvailableLocales("articles", SUPPORTED_LOCALES);
  if (!locales.includes(locale)) {
    notFound();
  }

  // Authenticated UI with header/footer
  return (
    <AuthenticatedHeaderLayout>
      <ArticlesPage authenticated locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
