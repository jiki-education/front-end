"use client";

import GuideCard from "@/components/guides/GuideCard";
import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import type { GuideMeta } from "@/lib/content/types";
import styles from "./GuidesSidebar.module.css";

interface GuidesSidebarProps {
  guides: GuideMeta[];
  locale: string;
  /** One-line explanation of how these guides relate to the page. */
  description: string;
}

export default function GuidesSidebar({ guides, locale, description }: GuidesSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Guides</h3>
      <p className={styles.lead}>{description}</p>
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
