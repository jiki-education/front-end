"use client";

import YouTube from "react-youtube";
import styles from "./BuildIndex.module.css";

export function PlaceholderVideo({ videoId }: { videoId: string }) {
  return (
    <div className={styles.placeholderVideo}>
      <YouTube
        videoId={videoId}
        className={styles.placeholderVideoPlayer}
        iframeClassName={styles.placeholderVideoPlayer}
        opts={{
          playerVars: {
            modestbranding: 1,
            rel: 0
          }
        }}
      />
    </div>
  );
}
