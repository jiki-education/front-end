"use client";

import Link from "next/link";
import LockIcon from "@/icons/lock.svg";
import { localePath } from "@/lib/i18n/routes";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import type { GuideMeta } from "@/lib/content/types";
import styles from "./SidebarGuideCard.module.css";

interface SidebarGuideCardProps {
  guide: GuideMeta;
  locale: string;
  /** Render the locked treatment (purple tinge + lock badge) and open the upgrade modal on click. */
  premiumLocked?: boolean;
}

/**
 * Text-only guide card for the project/episode sidebars — no cover image or
 * tags. The full card used on the guides pages is GuideCard.
 */
export default function SidebarGuideCard({ guide, locale, premiumLocked = false }: SidebarGuideCardProps) {
  const inner = (
    <>
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
    <Link href={localePath(`/guides/${guide.slug}`, locale)} className={styles.card}>
      {inner}
    </Link>
  );
}
