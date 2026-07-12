import GuideDetailPage, { getGuideMetadata } from "@/components/guides/GuideDetailPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getGuideMetadata(slug, locale);
}

export default async function AuthenticatedLocaleGuidePage({ params }: Props) {
  const { locale, slug } = await params;

  return (
    <SidebarLayout activeItem="guides">
      <GuideDetailPage slug={slug} locale={locale} />
    </SidebarLayout>
  );
}
