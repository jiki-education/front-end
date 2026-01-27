import BlogPage from "@/components/blog/BlogPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@/lib/content";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const locales = await getAvailableLocales("blog", SUPPORTED_LOCALES);
  return locales.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Blog - Jiki",
    es: "Blog - Jiki"
  };

  const descriptions: Record<string, string> = {
    en: "Read the latest articles about programming, coding challenges, and learning tips from the Jiki community.",
    es: "Lee los últimos artículos sobre programación, desafíos de código y consejos de aprendizaje de la comunidad Jiki."
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en
  };
}

export default async function AuthenticatedLocaleBlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect("/blog");
  }

  // Check if locale is supported and has blog posts
  const locales = await getAvailableLocales("blog", SUPPORTED_LOCALES);
  if (!locales.includes(locale)) {
    notFound();
  }

  // Authenticated UI with header/footer
  return (
    <AuthenticatedHeaderLayout>
      <BlogPage authenticated locale={locale} page={page} />
    </AuthenticatedHeaderLayout>
  );
}
