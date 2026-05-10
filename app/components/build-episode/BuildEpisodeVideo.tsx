"use client";

import { CloseButton } from "@/components/ui-kit";
import type { BuildVideoProvider } from "@/lib/content/types";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { useBuildEpisodeProgress } from "./lib/useBuildEpisodeProgress";
import styles from "./BuildEpisodeVideo.module.css";

interface BuildEpisodeVideoProps {
  uuid: string;
  seriesSlug: string;
  videoProvider: BuildVideoProvider;
  videoKey: string;
}

export default function BuildEpisodeVideo({ uuid, seriesSlug, videoProvider, videoKey }: BuildEpisodeVideoProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const {
    muxPlayerRef,
    handleMuxTimeUpdate,
    handleMuxEnded,
    handleMuxLoadedMetadata,
    handleYouTubeReady,
    handleYouTubeStateChange,
    startYouTubePolling
  } = useBuildEpisodeProgress(uuid);

  useEffect(() => {
    if (videoProvider !== "youtube") {
      return;
    }
    return startYouTubePolling();
  }, [videoProvider, startYouTubePolling]);

  return (
    <div className={`${styles.container} ${styles.gridBackgroundLight}`}>
      <CloseButton variant="glass" className={styles.closeButton} onClick={() => router.push(`/build/${seriesSlug}`)} />

      <div className={styles.videoContainer}>
        {videoProvider === "mux" ? (
          <MuxPlayer
            ref={muxPlayerRef}
            playbackId={videoKey}
            streamType="on-demand"
            autoPlay={false}
            className={`${styles.player} ${isReady ? "" : styles.playerHidden}`}
            onTimeUpdate={handleMuxTimeUpdate}
            onEnded={handleMuxEnded}
            onLoadedMetadata={() => {
              handleMuxLoadedMetadata();
              setIsReady(true);
            }}
          />
        ) : (
          <YouTube
            videoId={videoKey}
            className={`${styles.player} ${isReady ? "" : styles.playerHidden}`}
            iframeClassName={styles.player}
            opts={{
              playerVars: {
                modestbranding: 1,
                rel: 0
              }
            }}
            onReady={(event) => {
              handleYouTubeReady(event);
              setIsReady(true);
            }}
            onStateChange={handleYouTubeStateChange}
          />
        )}

        {!isReady && (
          <div className={styles.spinnerOverlay}>
            <div className={styles.spinner} />
          </div>
        )}
      </div>
    </div>
  );
}
