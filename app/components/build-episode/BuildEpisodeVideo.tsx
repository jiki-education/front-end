"use client";

import { CloseButton } from "@/components/ui-kit";
import { useAuthStore } from "@/lib/auth/authStore";
import type { BuildVideoProvider } from "@/lib/content/types";
import { showModal } from "@/lib/modal";
import premiumModalStyles from "@/lib/modal/modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import { tierIncludes } from "@/lib/pricing";
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
  premium: boolean;
}

export default function BuildEpisodeVideo({
  uuid,
  seriesSlug,
  videoProvider,
  videoKey,
  premium
}: BuildEpisodeVideoProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");
  const isLocked = premium && !userIsPremium;

  useEffect(() => {
    if (isAuthLoading || !isLocked) {
      return;
    }
    showModal(
      "premium-upgrade-modal",
      {},
      premiumModalStyles.premiumModalOverlay,
      premiumModalStyles.premiumModalWidth
    );
    router.replace(`/build/${seriesSlug}`);
  }, [isAuthLoading, isLocked, router, seriesSlug]);

  const [isReady, setIsReady] = useState(false);
  const {
    muxPlayerRef,
    handleMuxTimeUpdate,
    handleMuxEnded,
    handleMuxLoadedMetadata,
    handleYouTubeReady,
    handleYouTubeStateChange
  } = useBuildEpisodeProgress(uuid, videoProvider);

  // Don't render the player at all for locked episodes — the effect above
  // will redirect once auth has resolved.
  if (isAuthLoading || isLocked) {
    return (
      <div className={`${styles.container} ${styles.gridBackgroundLight}`}>
        <div className={styles.videoContainer}>
          <div className={styles.spinnerOverlay}>
            <div className={styles.spinner} />
          </div>
        </div>
      </div>
    );
  }

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
