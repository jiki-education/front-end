import type { GuideMeta } from "@/lib/content/types";
import GuideCard from "./GuideCard";
import styles from "../articles/RelatedArticles.module.css";

interface RelatedGuidesProps {
  guides: GuideMeta[];
  locale: string;
}

export default function RelatedGuides({ guides, locale }: RelatedGuidesProps) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className={styles.relatedArticlesTitle}>Related Guides</h3>
      <div className={styles.relatedArticlesSection}>
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} locale={locale} compact />
        ))}
      </div>
    </div>
  );
}
