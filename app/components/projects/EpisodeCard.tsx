"use client";

import Image from "next/image";
import Link from "next/link";
import LockIcon from "@/icons/lock.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import { localePath } from "@/lib/i18n/routes";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { tierIncludes } from "@/lib/pricing";
import { staticAsset } from "@/lib/static-asset";
import type { EpisodeMeta, ProjectMeta } from "@/lib/content/types";
import styles from "./EpisodeCard.module.css";

interface EpisodeCardProps {
  project: ProjectMeta;
  episode: EpisodeMeta;
  locale: string;
  watchedPercentage?: number;
}

export function EpisodeCard({ project, episode, locale, watchedPercentage }: EpisodeCardProps) {
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");
  const showAsPremium = episode.premium && !userIsPremium;
  const showProgress = typeof watchedPercentage === "number" && watchedPercentage > 0;
  const inner = (
    <>
      <div className={styles.cardImageWrapper}>
        <Image
          src={staticAsset(`images/projects/episodes/${episode.image}`)}
          alt=""
          width={240}
          height={135}
          className={styles.cardImage}
        />
        {showAsPremium && (
          <span className={styles.premiumPill}>
            <LockIcon className={styles.premiumIcon} />
            Premium
          </span>
        )}
        {showProgress && (
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${Math.min(watchedPercentage, 100)}%` }} />
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{episode.title}</h2>
        <p className={styles.cardExcerpt}>{episode.excerpt}</p>
      </div>
    </>
  );

  if (showAsPremium) {
    return (
      <button
        type="button"
        className={`${styles.card} ${styles.cardPremium}`}
        onClick={() =>
          showPremiumUpgradeModal("locked_episode", {
            contextType: "episode",
            contextUuid: episode.uuid
          })
        }
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={localePath(`/projects/${project.slug}/episodes/${episode.slug}`, locale)} className={styles.card}>
      {inner}
    </Link>
  );
}
