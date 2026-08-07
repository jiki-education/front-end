import BlogPage from "@/components/blog/BlogPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { SUPPORTED_LOCALES } from "@/lib/locales";
import { hasContent } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.blog" });

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function AuthenticatedLocaleBlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;

  // The default locale is served here under the naked URL (/blog), rewritten to
  // /en/blog by middleware; an explicit /en/blog is redirected back to /blog there.
  // Per-locale, and fetched: whether this locale has content is a fact about the
  // published corpus, not about what existed when this build ran.
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale) || !(await hasContent("blog", locale))) {
    notFound();
  }

  // Authenticated UI with header/footer
  return (
    <AuthenticatedHeaderLayout>
      <BlogPage authenticated locale={locale} page={page} />
    </AuthenticatedHeaderLayout>
  );
}
