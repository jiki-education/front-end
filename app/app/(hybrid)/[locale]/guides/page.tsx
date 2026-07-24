import GuidesPage from "@/components/guides/GuidesPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { SUPPORTED_LOCALES } from "@/lib/locales";
import { getAvailableLocales } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.guides" });

  return {
    title: t("title"),
    description: t("description")
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
    <SidebarLayout activeItem="guides">
      <GuidesPage locale={locale} tag={tag} />
    </SidebarLayout>
  );
}
