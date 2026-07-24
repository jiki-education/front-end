import GuideDetailPage, { getGuideMetadata } from "@/components/guides/GuideDetailPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import JsonLd from "@/components/seo/JsonLd";
import { getAllGuides } from "@/lib/content";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return await getGuideMetadata(slug, locale);
}

export default async function AuthenticatedLocaleGuidePage({ params }: Props) {
  const { locale, slug } = await params;

  // Guides are reference articles (not step-based how-tos), so TechArticle. Their
  // single `date` is a "last updated" stamp, hence dateModified.
  const guide = getAllGuides(locale).find((g) => g.slug === slug);
  const jsonLd = guide
    ? [
        articleSchema({
          type: "TechArticle",
          path: `/guides/${slug}`,
          locale,
          headline: guide.title,
          description: guide.seo.description || guide.excerpt,
          datePublished: guide.date,
          dateModified: guide.date,
          image: guide.coverImage,
          keywords: guide.seo.keywords.length > 0 ? guide.seo.keywords : guide.tags
        }),
        breadcrumbSchema(
          [
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${slug}` }
          ],
          locale
        )
      ]
    : null;

  return (
    <SidebarLayout activeItem="guides">
      {jsonLd && <JsonLd data={jsonLd} />}
      <GuideDetailPage slug={slug} locale={locale} />
    </SidebarLayout>
  );
}
