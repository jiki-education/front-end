import BlogPage from "@/components/blog/BlogPage";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@jiki/content";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  const locales = getAvailableLocales("blog", SUPPORTED_LOCALES);
  return locales.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export default async function LocaleBlogPage({ params }: Props) {
  const { locale } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect("/blog");
  }

  // Check if locale is supported and has blog posts
  const locales = getAvailableLocales("blog", SUPPORTED_LOCALES);
  if (!locales.includes(locale)) {
    notFound();
  }

  return <BlogPage authenticated={false} locale={locale} />;
}
