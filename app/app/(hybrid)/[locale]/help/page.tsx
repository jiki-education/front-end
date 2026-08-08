import ArticlesPage from "@/components/articles/ArticlesPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { isSupportedLocale } from "@/lib/i18n/config";
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
  // The locale list is the only gate. A locale is either fully translated or it
  // is not served, so being supported already means it has this content; asking
  // again at request time would put a fetch on the path of a cacheable page to
  // answer a question the list has already answered.
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <AuthenticatedHeaderLayout>
      <ArticlesPage authenticated locale={locale} tag={tag} page={page} />
    </AuthenticatedHeaderLayout>
  );
}
