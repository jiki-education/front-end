"use client";

import MuxPlayer from "@mux/mux-player-react";
import styles from "./VideoWalkthroughModal.module.css";

interface VideoWalkthroughModalProps {
  playbackId: string;
}

export function VideoWalkthroughModal({ playbackId }: VideoWalkthroughModalProps) {
  return (
    <div className={styles.videoWrapper}>
      <MuxPlayer
        playbackId={playbackId}
        streamType="on-demand"
        autoPlay={true}
        loop={false}
        muted={false}
        volume={0.5}
        className={styles.muxPlayer}
      />
    </div>
  );
}
