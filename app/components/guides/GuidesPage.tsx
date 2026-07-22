import { getAllGuides, GUIDE_TAG_SLUGS, type GuideTagSlug } from "@/lib/content";
import GuidesContent from "./GuidesContent";

interface GuidesPageProps {
  locale: string;
  tag?: string | null;
}

export default function GuidesPage({ locale, tag }: GuidesPageProps) {
  // Validate tag param against the fixed guide tag set.
  const validTag = tag && GUIDE_TAG_SLUGS.includes(tag as GuideTagSlug) ? (tag as GuideTagSlug) : null;

  // All guides (including premium) are passed to the client, which gates premium
  // ones based on the viewer's membership. Tag filtering is not premium-related,
  // so it is safe to apply here.
  let guides = getAllGuides(locale);
  if (validTag) {
    guides = guides.filter((guide) => guide.tags.includes(validTag));
  }

  return <GuidesContent guides={guides} locale={locale} selectedTag={validTag} tagSlugs={GUIDE_TAG_SLUGS} />;
}
