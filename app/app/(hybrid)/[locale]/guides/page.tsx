import GuidesPage from "@/components/guides/GuidesPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
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
  // The locale list is the only gate. A locale is either fully translated or it
  // is not served, so being supported already means it has this content; asking
  // again at request time would put a fetch on the path of a cacheable page to
  // answer a question the list has already answered.
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <SidebarLayout activeItem="guides">
      <GuidesPage locale={locale} tag={tag} />
    </SidebarLayout>
  );
}
