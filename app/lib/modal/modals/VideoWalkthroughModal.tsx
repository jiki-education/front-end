"use client";

import dynamic from "next/dynamic";
import { useWalkthroughProgress } from "./useWalkthroughProgress";
import styles from "./VideoWalkthroughModal.module.css";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

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
