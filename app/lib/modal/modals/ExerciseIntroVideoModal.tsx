"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { VideoSource } from "@/types/lesson";
import { videoThumbnailUrl } from "@/lib/videos/thumbnail";
import { hideModal } from "../store";
import styles from "./ExerciseIntroVideoModal.module.css";

const VideoPlayer = dynamic(() => import("@/components/ui/JikiVideoPlayer"), { ssr: false });
const YouTubePlayer = dynamic(() => import("@/components/youtube-player/JikiYouTubePlayer"), { ssr: false });

interface ExerciseIntroVideoModalProps {
  video: VideoSource;
}

/**
 * An exercise's intro video, opened once when the exercise is first seen.
 *
 * Unlike the deep dive this reports no progress: a walkthrough of the solve is
 * something the API tracks per lesson, whereas the intro is just the setup and
 * the student is free to close it and start.
 */
export function ExerciseIntroVideoModal({ video }: ExerciseIntroVideoModalProps) {
  const t = useTranslations("modals.exerciseIntroVideo");
  // The modal opens uninvited, so it shows a poster until the student asks for
  // the video. Nothing loads or plays until they do.
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.content}>
      <h4>{t("title")}</h4>
      <p>{t("intro")}</p>
      {playing ? (
        <div className={styles.videoWrapper}>
          {video.provider === "youtube" ? (
            <YouTubePlayer videoId={video.id} className={styles.player} />
          ) : (
            <VideoPlayer playbackId={video.id} autoPlay={true} className={styles.player} />
          )}
        </div>
      ) : (
        <button type="button" className={styles.thumbWrapper} onClick={() => setPlaying(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote poster, sized by the provider */}
          <img src={videoThumbnailUrl(video, 1280, 720)} alt={t("watchAlt")} className={styles.thumb} />
          <span className={styles.playBtn}>
            <svg viewBox="0 0 24 24">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </span>
        </button>
      )}
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={hideModal}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
