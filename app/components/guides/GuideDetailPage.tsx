import { getGuide, getAllGuides, getRelatedGuides } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideDetailContent from "./GuideDetailContent";

interface GuideDetailPageProps {
  slug: string;
  locale: string;
}

// Helper for generateMetadata
export function getGuideMetadata(slug: string, locale: string = "en"): Metadata {
  try {
    const allGuides = getAllGuides(locale);
    const guide = allGuides.find((g) => g.slug === slug);
    if (!guide) {
      return { title: "Guide Not Found" };
    }

    return {
      title: guide.title,
      description: guide.seo.description,
      keywords: guide.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Guide Not Found" };
  }
}

export default async function GuideDetailPage({ slug, locale }: GuideDetailPageProps) {
  let guide;
  try {
    guide = await getGuide(slug, locale);
  } catch {
    notFound();
  }

  const allGuides = getAllGuides(locale);
  const relatedGuides = getRelatedGuides(slug, allGuides, 3);

  return <GuideDetailContent guide={guide} relatedGuides={relatedGuides} locale={locale} />;
}
