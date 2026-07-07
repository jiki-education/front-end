import GuidesPage from "@/components/guides/GuidesPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Guides - Jiki"
  };

  const descriptions: Record<string, string> = {
    en: "Step by step guides to help you set up your tools and get the most out of Jiki."
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en
  };
}

export default async function AuthenticatedLocaleGuidesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tag } = await searchParams;

  // The default locale is served here under the naked URL (/guides), rewritten
  // to /en/guides by middleware; an explicit /en/guides is redirected back there.
  const locales = getAvailableLocales("guides", SUPPORTED_LOCALES);
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <AuthenticatedHeaderLayout>
      <GuidesPage locale={locale} tag={tag} />
    </AuthenticatedHeaderLayout>
  );
}
