"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useWalkthroughProgress } from "./useWalkthroughProgress";
import styles from "./VideoWalkthroughModal.module.css";

interface VideoWalkthroughModalProps {
  playbackId: string;
  lessonSlug: string;
}

export function VideoWalkthroughModal({ playbackId, lessonSlug }: VideoWalkthroughModalProps) {
  const { playerRef, handleTimeUpdate, handleVideoEnd, handleCanPlay } = useWalkthroughProgress(lessonSlug);

  return (
    <div className={styles.videoWrapper}>
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        autoPlay={true}
        loop={false}
        muted={false}
        volume={0.5}
        className={styles.muxPlayer}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onCanPlay={handleCanPlay}
      />
    </div>
  );
}
