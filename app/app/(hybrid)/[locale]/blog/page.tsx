import BlogPage from "@/components/blog/BlogPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@/lib/content/loader";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  const locales = await getAvailableLocales("blog", SUPPORTED_LOCALES);
  return locales.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export default async function AuthenticatedLocaleBlogPage({ params }: Props) {
  const { locale } = await params;

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
      <BlogPage authenticated locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
