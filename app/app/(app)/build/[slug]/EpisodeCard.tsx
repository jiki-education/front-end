"use client";

import Image from "next/image";
import Link from "next/link";
import LockIcon from "@/icons/lock.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import { showPremiumUpgradeModal } from "@/lib/modal";
import { tierIncludes } from "@/lib/pricing";
import type { BuildEpisodeMeta, BuildSeriesMeta } from "@/lib/content/types";
import styles from "./SeriesPage.module.css";

interface EpisodeCardProps {
  series: BuildSeriesMeta;
  episode: BuildEpisodeMeta;
  watchedPercentage?: number;
}

export function EpisodeCard({ series, episode, watchedPercentage }: EpisodeCardProps) {
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");
  const showAsPremium = episode.premium && !userIsPremium;
  const showProgress = typeof watchedPercentage === "number" && watchedPercentage > 0;
  const inner = (
    <>
      <div className={styles.cardImageWrapper}>
        <Image
          src={`/static/images/build/episodes/${episode.image}`}
          alt=""
          width={480}
          height={270}
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
      <h2 className={styles.cardTitle}>{episode.title}</h2>
      <p className={styles.cardExcerpt}>{episode.excerpt}</p>
    </>
  );

  if (showAsPremium) {
    return (
      <button
        type="button"
        className={`${styles.card} ${styles.cardPremium}`}
        onClick={() =>
          showPremiumUpgradeModal("locked_episode", {
            contextType: "Episode",
            contextId: episode.slug
          })
        }
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={`/build/${series.slug}/${episode.slug}`} className={styles.card}>
      {inner}
    </Link>
  );
}
