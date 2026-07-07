import GuideDetailPage, { getGuideMetadata } from "@/components/guides/GuideDetailPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
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
    <AuthenticatedHeaderLayout>
      <GuideDetailPage slug={slug} locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
