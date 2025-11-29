import BlogPage from "@/components/blog/BlogPage";
import AuthenticatedLayout from "@/components/layout/authenticated";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/config/locales";
import { getAvailableLocales } from "@jiki/content";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  const locales = getAvailableLocales("blog", SUPPORTED_LOCALES);
  return locales.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export default async function AuthenticatedLocaleBlogPage({ params }: Props) {
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

  // Authenticated UI with header/footer
  return (
    <AuthenticatedLayout>
      <BlogPage authenticated locale={locale} />
    </AuthenticatedLayout>
  );
}
