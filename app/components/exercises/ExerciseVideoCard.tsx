"use client";

import { useTranslations } from "next-intl";
import { showVideoWalkthrough } from "@/lib/modal/app";
import type { VideoSource } from "@/types/lesson";
import styles from "./ExerciseVideoCard.module.css";

interface ExerciseVideoCardProps {
  slug: string;
  video: VideoSource;
}

/**
 * The deep-dive walkthrough, offered to logged-out visitors as the proof that
 * there's a teacher behind the exercise. It plays in the same walkthrough modal
 * the app uses, so there is one video player across the site.
 */
export function ExerciseVideoCard({ slug, video }: ExerciseVideoCardProps) {
  const t = useTranslations("exercises.public.video");
  const thumbnailUrl = `https://image.mux.com/${video.id}/thumbnail.jpg?width=1280&height=720`;

  const play = () => showVideoWalkthrough({ playbackId: video.id, lessonSlug: slug });

  return (
    <section className={styles.card}>
      <h2 className={styles.header}>{t("header")}</h2>
      <p className={styles.description}>{t("description")}</p>
      <div
        className={styles.thumbnail}
        onClick={play}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            play();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={t("playAriaLabel")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt={t("thumbnailAlt")} />
        <div className={styles.playBtn}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </div>
      </div>
    </section>
  );
}
