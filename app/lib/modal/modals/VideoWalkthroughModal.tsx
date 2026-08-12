"use client";

import dynamic from "next/dynamic";
import { useWalkthroughProgress } from "./useWalkthroughProgress";
import styles from "./VideoWalkthroughModal.module.css";

const VideoPlayer = dynamic(() => import("@/components/ui/JikiVideoPlayer"), { ssr: false });

interface VideoWalkthroughModalProps {
  playbackId: string;
  lessonSlug: string;
}

export function VideoWalkthroughModal({ playbackId, lessonSlug }: VideoWalkthroughModalProps) {
  const { playerRef, handleTimeUpdate, handleVideoEnd, restorePosition } = useWalkthroughProgress(lessonSlug);

  return (
    <div className={styles.videoWrapper}>
      <VideoPlayer
        ref={playerRef}
        playbackId={playbackId}
        autoPlay={true}
        className={styles.muxPlayer}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onLoadedMetadata={restorePosition}
        onCanPlay={restorePosition}
      />
    </div>
  );
}
