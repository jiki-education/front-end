import { getGuide, getAllGuides, getRelatedGuides } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import GuideDetailContent from "./GuideDetailContent";

interface GuideDetailPageProps {
  slug: string;
  locale: string;
}

// Helper for generateMetadata
export async function getGuideMetadata(slug: string, locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "guides.metadata" });
  try {
    const allGuides = await getAllGuides(locale);
    const guide = allGuides.find((g) => g.slug === slug);
    if (!guide) {
      return { title: t("notFoundTitle") };
    }

    return {
      title: guide.title,
      description: guide.seo.description,
      keywords: guide.seo.keywords.join(", ")
    };
  } catch {
    return { title: t("notFoundTitle") };
  }
}

export default async function GuideDetailPage({ slug, locale }: GuideDetailPageProps) {
  let guide;
  try {
    guide = await getGuide(slug, locale);
  } catch {
    notFound();
  }

  const allGuides = await getAllGuides(locale);
  const relatedGuides = getRelatedGuides(slug, allGuides, 5);

  return <GuideDetailContent guide={guide} relatedGuides={relatedGuides} locale={locale} />;
}
