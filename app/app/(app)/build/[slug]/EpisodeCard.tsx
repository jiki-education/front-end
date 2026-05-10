"use client";

import Image from "next/image";
import Link from "next/link";
import LockIcon from "@/icons/lock.svg";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import type { BuildEpisodeMeta, BuildSeriesMeta } from "@/lib/content/types";
import styles from "./SeriesPage.module.css";

interface EpisodeCardProps {
  series: BuildSeriesMeta;
  episode: BuildEpisodeMeta;
}

export function EpisodeCard({ series, episode }: EpisodeCardProps) {
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
        {episode.premium && (
          <span className={styles.premiumPill}>
            <LockIcon className={styles.premiumIcon} />
            Premium
          </span>
        )}
      </div>
      <h2 className={styles.cardTitle}>{episode.title}</h2>
      <p className={styles.cardExcerpt}>{episode.excerpt}</p>
    </>
  );

  if (episode.premium) {
    return (
      <button
        type="button"
        className={`${styles.card} ${styles.cardPremium}`}
        onClick={() =>
          showModal(
            "premium-upgrade-modal",
            {},
            premiumModalStyles.premiumModalOverlay,
            premiumModalStyles.premiumModalWidth
          )
        }
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={`/build/${series.slug}/${episode.uuid}`} className={styles.card}>
      {inner}
    </Link>
  );
}
