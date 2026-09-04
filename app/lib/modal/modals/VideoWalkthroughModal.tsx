"use client";

import dynamic from "next/dynamic";
import type { VideoSource } from "@/types/lesson";
import { useWalkthroughProgress } from "./useWalkthroughProgress";
import styles from "./VideoWalkthroughModal.module.css";

const VideoPlayer = dynamic(() => import("@/components/ui/JikiVideoPlayer"), { ssr: false });
const YouTubePlayer = dynamic(() => import("@/components/youtube-player/JikiYouTubePlayer"), { ssr: false });

interface VideoWalkthroughModalProps {
  video: VideoSource;
  lessonSlug: string;
  onProgress?: (percentage: number) => void;
}

export function VideoWalkthroughModal({ video, lessonSlug, onProgress }: VideoWalkthroughModalProps) {
  const { playerRef, handleTimeUpdate, handleVideoEnd, restorePosition, handleYouTubeReady, handleYouTubeStateChange } =
    useWalkthroughProgress(lessonSlug, video.provider, onProgress);

  return (
    <div className={styles.videoWrapper}>
      {video.provider === "youtube" ? (
        <YouTubePlayer
          videoId={video.id}
          className={styles.muxPlayer}
          onRawReady={handleYouTubeReady}
          onRawStateChange={handleYouTubeStateChange}
        />
      ) : (
        <VideoPlayer
          ref={playerRef}
          playbackId={video.id}
          autoPlay={true}
          className={styles.muxPlayer}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onLoadedMetadata={restorePosition}
          onCanPlay={restorePosition}
        />
      )}
    </div>
  );
}
