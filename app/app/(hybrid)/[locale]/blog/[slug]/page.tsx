import BlogPostPage, { getBlogPostMetadata } from "@/components/blog/BlogPostPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { getAllPostSlugsWithLocales } from "@/lib/content/loader";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugsWithLocales = await getAllPostSlugsWithLocales("blog", SUPPORTED_LOCALES);
  return slugsWithLocales.filter((p) => p.locale !== DEFAULT_LOCALE).map((p) => ({ locale: p.locale, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (locale === DEFAULT_LOCALE) {
    return { title: "Redirecting..." };
  }

  return await getBlogPostMetadata(slug, locale);
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
