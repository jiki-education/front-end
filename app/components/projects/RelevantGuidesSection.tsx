"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import type { GuideMeta } from "@/lib/content/types";
import GuideCard from "@/components/guides/GuideCard";
import styles from "./RelevantGuidesSection.module.css";

interface RelevantGuidesSectionProps {
  guides: GuideMeta[];
  locale: string;
  /** One-line explanation of how these guides relate to the page. */
  description: string;
}

/**
 * Full-width row of guide cards shown below the episode video, using the
 * same GuideCard as the guides listing page.
 */
export default function RelevantGuidesSection({ guides, locale, description }: RelevantGuidesSectionProps) {
  const t = useTranslations("projects.relevantGuides");
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");

  return (
    <section className={styles.container}>
      <div className={styles.intro}>
        <h2 className={styles.heading}>{t("heading")}</h2>
        <p className={styles.lead}>{description}</p>
      </div>
      <div className={styles.grid}>
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} locale={locale} premiumLocked={guide.premium && !userIsPremium} />
        ))}
      </div>
    </section>
  );
}
