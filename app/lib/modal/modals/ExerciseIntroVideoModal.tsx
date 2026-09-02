"use client";

import dynamic from "next/dynamic";
import type { VideoSource } from "@/types/lesson";
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
  return (
    <div className={styles.videoWrapper}>
      {video.provider === "youtube" ? (
        <YouTubePlayer videoId={video.id} className={styles.player} />
      ) : (
        <VideoPlayer playbackId={video.id} autoPlay={true} className={styles.player} />
      )}
    </div>
  );
}
