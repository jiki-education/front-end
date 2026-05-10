"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserVideos } from "@/lib/api/user-videos";
import type { BuildEpisodeMeta, BuildSeriesMeta } from "@/lib/content/types";
import { EpisodeCard } from "./EpisodeCard";
import styles from "./SeriesPage.module.css";

interface SeriesPageProps {
  series: BuildSeriesMeta;
  episodes: BuildEpisodeMeta[];
}

export function SeriesPage({ series, episodes }: SeriesPageProps) {
  const sorted = [...episodes].sort((a, b) => a.order - b.order);
  const [progressByUuid, setProgressByUuid] = useState<Record<string, number>>({});

  useEffect(() => {
    void fetchUserVideos().then((videos) => {
      const map: Record<string, number> = {};
      for (const video of videos) {
        map[video.uuid] = video.watched_percentage;
      }
      setProgressByUuid(map);
    });
  }, []);

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
