import ArticlesPage from "@/components/articles/ArticlesPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { SUPPORTED_LOCALES } from "@/lib/locales";
import { hasContent } from "@/lib/content";
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
  // Per-locale, and fetched: whether this locale has content is a fact about the
  // published corpus, not about what existed when this build ran.
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale) || !(await hasContent("articles", locale))) {
    notFound();
  }

  return (
    <AuthenticatedHeaderLayout>
      <ArticlesPage authenticated locale={locale} tag={tag} page={page} />
    </AuthenticatedHeaderLayout>
  );
}
