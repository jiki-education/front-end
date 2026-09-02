"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { VideoSource } from "@/types/lesson";
import { videoThumbnailUrl } from "@/lib/videos/thumbnail";
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
          // The YouTube player brings its own poster-and-play facade.
          <YouTubePlayer videoId={video.id} className={styles.playerInner} />
        ) : (
          <MuxVideoWithFacade video={video} />
        )}
      </div>
    </section>
  );
}

/**
 * The skin around our Mux playback shows a control bar but no centre play
 * button, which reads as an already-started video sitting at zero. A facade
 * gives the same "click the poster to play" affordance the YouTube player has,
 * and keeps the HLS stream unfetched until someone wants it.
 */
function MuxVideoWithFacade({ video }: { video: VideoSource }) {
  const t = useTranslations("exercises.public.video");
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return <VideoPlayer playbackId={video.id} autoPlay className={styles.playerInner} />;
  }

  const play = () => setIsPlaying(true);

  return (
    <div
      className={styles.facade}
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
      <img src={videoThumbnailUrl(video, 1280, 720)} alt="" />
      <div className={styles.playBtn}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="6,4 20,12 6,20" />
        </svg>
      </div>
    </div>
  );
}
