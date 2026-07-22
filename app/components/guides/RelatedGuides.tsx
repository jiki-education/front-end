import { useTranslations } from "next-intl";
import type { GuideMeta } from "@/lib/content/types";
import GuideCard from "./GuideCard";
import styles from "../articles/RelatedArticles.module.css";

interface RelatedGuidesProps {
  guides: GuideMeta[];
  locale: string;
}

export default function RelatedGuides({ guides, locale }: RelatedGuidesProps) {
  const t = useTranslations("guides.relatedGuides");
  if (guides.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className={styles.relatedArticlesTitle}>{t("heading")}</h3>
      <div className={styles.relatedArticlesSection}>
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} locale={locale} compact />
        ))}
      </div>
    </div>
  );
}
