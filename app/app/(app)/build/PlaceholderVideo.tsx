"use client";

import dynamic from "next/dynamic";
import styles from "./BuildIndex.module.css";

const MuxPlayer = dynamic(() => import("@/components/ui/JikiMuxPlayer"), { ssr: false });

export function PlaceholderVideo({ playbackId }: { playbackId: string }) {
  return (
    <div className={styles.placeholderVideo}>
      <MuxPlayer
        playbackId={playbackId}
        className={styles.placeholderVideoPlayer}
        style={{
          ["--seek-backward-button" as string]: "none",
          ["--seek-forward-button" as string]: "none"
        }}
      />
    </div>
  );
}
