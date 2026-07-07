"use client";

import Link from "next/link";
import { localePath } from "@/lib/i18n/routes";
import LockIcon from "@/icons/lock.svg";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { getGuideTagLabel, type GuideMeta, type GuideTagSlug } from "@/lib/content/types";
import styles from "./GuideCard.module.css";

interface GuideCardProps {
  guide: GuideMeta;
  locale: string;
  /** Render the locked treatment (purple tinge + lock badge) and open the upgrade modal on click. */
  premiumLocked?: boolean;
  compact?: boolean;
}

export default function GuideCard({ guide, locale, premiumLocked = false, compact = false }: GuideCardProps) {
  const firstTag = guide.tags[0] as GuideTagSlug | undefined;
  const tagLabel = firstTag ? getGuideTagLabel(firstTag, locale) : null;

  const inner = (
    <>
      <div
        className={styles.coverImage}
        style={guide.coverImage ? { backgroundImage: `url(${guide.coverImage})` } : undefined}
      />
      {tagLabel && (
        <div className={styles.meta}>
          <span className={styles.badge}>{tagLabel}</span>
        </div>
      )}
      <h4 className={styles.title}>{guide.title}</h4>
      <p className={styles.excerpt}>{guide.excerpt}</p>
    </>
  );

  if (premiumLocked) {
    return (
      <button
        type="button"
        onClick={() => showPremiumUpgradeModal("locked_guide", { contextType: "guide", contextSlug: guide.slug })}
        className={styles.card}
        data-state="premium-locked"
      >
        <div className={styles.lockBadge}>
          <LockIcon className={styles.lockIcon} />
          Premium
        </div>
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={localePath(`/guides/${guide.slug}`, locale)}
      className={`${styles.card} ${compact ? styles.compact : ""}`}
    >
      {inner}
    </Link>
  );
}
