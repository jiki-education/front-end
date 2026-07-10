"use client";

import GuideCard from "@/components/guides/GuideCard";
import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import type { GuideMeta } from "@/lib/content/types";
import styles from "./EpisodeGuides.module.css";

interface EpisodeGuidesProps {
  guides: GuideMeta[];
  locale: string;
}

export default function EpisodeGuides({ guides, locale }: EpisodeGuidesProps) {
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Guides</h3>
      <p className={styles.lead}>Written guides covering what we use in this episode.</p>
      <div className={styles.list}>
        {guides.map((guide) => (
          <GuideCard
            key={guide.slug}
            guide={guide}
            locale={locale}
            premiumLocked={guide.premium && !userIsPremium}
            compact
          />
        ))}
      </div>
    </div>
  );
}
