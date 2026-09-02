"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { VideoSource } from "@/types/lesson";
import styles from "./ExerciseVideoCard.module.css";

const VideoPlayer = dynamic(() => import("@/components/ui/JikiVideoPlayer"), { ssr: false });
const YouTubePlayer = dynamic(() => import("@/components/youtube-player/JikiYouTubePlayer"), { ssr: false });

interface ExerciseVideoCardProps {
  video: VideoSource;
}

/**
 * The deep-dive walkthrough, offered to logged-out visitors as the proof that
 * there's a teacher behind the exercise. It plays inline: there is no progress
 * to record for someone without an account, so a modal would only add a click.
 */
export function ExerciseVideoCard({ video }: ExerciseVideoCardProps) {
  const t = useTranslations("exercises.public.video");

  return (
    <section className={styles.card}>
      <h2 className={styles.header}>{t("header")}</h2>
      <p className={styles.description}>{t("description")}</p>
      <div className={styles.player}>
        {video.provider === "youtube" ? (
          <YouTubePlayer videoId={video.id} className={styles.playerInner} />
        ) : (
          <VideoPlayer playbackId={video.id} className={styles.playerInner} />
        )}
      </div>
    </section>
  );
}
