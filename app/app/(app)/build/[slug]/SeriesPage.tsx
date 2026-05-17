"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserVideos } from "@/lib/api/user-videos";
import { BLOCKED_FEATURES, trackEvent } from "@/lib/analytics";
import { useAuthStore } from "@/lib/auth/authStore";
import { tierIncludes } from "@/lib/pricing";
import type { BuildEpisodeMeta, BuildSeriesMeta } from "@/lib/content/types";
import { EpisodeCard } from "./EpisodeCard";
import styles from "./SeriesPage.module.css";

const WATCHED_THRESHOLD = 95;

interface SeriesPageProps {
  series: BuildSeriesMeta;
  episodes: BuildEpisodeMeta[];
}

export function SeriesPage({ series, episodes }: SeriesPageProps) {
  const sorted = [...episodes].sort((a, b) => a.order - b.order);
  const [progressByUuid, setProgressByUuid] = useState<Record<string, number>>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");

  useEffect(() => {
    let cancelled = false;
    void fetchUserVideos().then((videos) => {
      if (cancelled) {
        return;
      }
      const map: Record<string, number> = {};
      for (const video of videos) {
        map[video.uuid] = video.watched_percentage;
      }
      setProgressByUuid(map);
      setProgressLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // If a free user has watched all the free episodes in this series and only
  // premium ones remain, the page is effectively a paywall for them. Wait for
  // progress to load so we don't false-positive before we know what's watched.
  useEffect(() => {
    if (!progressLoaded || userIsPremium) return;
    const remainingFree = episodes.filter(
      (ep) => !ep.premium && (progressByUuid[ep.uuid] ?? 0) < WATCHED_THRESHOLD
    );
    const remainingPremium = episodes.filter(
      (ep) => ep.premium && (progressByUuid[ep.uuid] ?? 0) < WATCHED_THRESHOLD
    );
    if (remainingFree.length === 0 && remainingPremium.length > 0) {
      trackEvent("premium_feature_blocked", {
        feature: BLOCKED_FEATURES.BUILD_PAGE_ALL_LOCKED,
        context_type: "BuildSeries",
        context_id: series.slug
      });
    }
  }, [progressLoaded, userIsPremium, episodes, progressByUuid, series.slug]);

  return (
    <div className={styles.wrapper}>
      <Link href="/build" className={styles.backLink}>
        ← Back to all Series
      </Link>
      <h1 className={styles.title}>{series.title}</h1>
      <p className={styles.description}>{series.description}</p>

      <div className={styles.grid}>
        {sorted.map((episode) => (
          <EpisodeCard
            key={episode.uuid}
            series={series}
            episode={episode}
            watchedPercentage={progressByUuid[episode.uuid]}
          />
        ))}
      </div>
    </div>
  );
}
