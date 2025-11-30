import BlogPostPage, { getBlogPostMetadata } from "@/components/blog/BlogPostPage";
import AuthenticatedHeaderLayout from "@/components/layout/AuthenticatedHeaderLayout";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/config/locales";
import { getAllPostSlugsWithLocales } from "@jiki/content";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllPostSlugsWithLocales("blog", SUPPORTED_LOCALES)
    .filter((p) => p.locale !== DEFAULT_LOCALE)
    .map((p) => ({ locale: p.locale, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (locale === DEFAULT_LOCALE) {
    return { title: "Redirecting..." };
  }

  return getBlogPostMetadata(slug, locale);
}

export default async function AuthenticatedLocaleBlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  // Redirect default locale to naked URL
  if (locale === DEFAULT_LOCALE) {
    redirect(`/blog/${slug}`);
  }

  return (
    <AuthenticatedHeaderLayout>
      <BlogPostPage slug={slug} authenticated={true} locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
