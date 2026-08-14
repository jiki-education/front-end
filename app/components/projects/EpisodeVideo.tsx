"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import type { VideoProvider } from "@/lib/content/types";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import { tierIncludes } from "@/lib/pricing";
import VideoPlayer from "@/components/ui/JikiVideoPlayer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JikiYouTubePlayer from "@/components/youtube-player/JikiYouTubePlayer";
import { useEpisodeProgress } from "./lib/useEpisodeProgress";
import styles from "./EpisodeVideo.module.css";

interface EpisodeVideoProps {
  uuid: string;
  /** Locale-aware path of the parent project page, used when redirecting locked viewers away. */
  projectPath: string;
  videoProvider: VideoProvider;
  videoKey: string;
  premium: boolean;
}

export default function EpisodeVideo({ uuid, projectPath, videoProvider, videoKey, premium }: EpisodeVideoProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");
  const isLocked = premium && !userIsPremium;

  useEffect(() => {
    if (isAuthLoading || !isLocked) {
      return;
    }
    showPremiumUpgradeModal("locked_episode_video", {
      contextType: "episode",
      contextUuid: uuid
    });
    router.replace(projectPath);
  }, [isAuthLoading, isLocked, router, projectPath, uuid]);

  const [isReady, setIsReady] = useState(false);
  const {
    muxPlayerRef,
    handleMuxTimeUpdate,
    handleMuxEnded,
    handleMuxLoadedMetadata,
    handleYouTubeReady,
    handleYouTubeStateChange
  } = useEpisodeProgress(uuid, videoProvider);

  // Don't render the player at all for locked episodes — the effect above
  // will redirect once auth has resolved.
  if (isAuthLoading || isLocked) {
    return (
      <div className={styles.videoContainer}>
        <div className={styles.spinnerOverlay}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      {videoProvider === "mux" ? (
        <VideoPlayer
          ref={muxPlayerRef}
          playbackId={videoKey}
          autoPlay={false}
          className={`${styles.player} ${isReady ? "" : styles.playerHidden}`}
          onTimeUpdate={handleMuxTimeUpdate}
          onEnded={handleMuxEnded}
          onLoadedMetadata={() => {
            handleMuxLoadedMetadata();
            setIsReady(true);
          }}
          onError={() => setIsReady(true)}
        />
      ) : (
        <JikiYouTubePlayer
          videoId={videoKey}
          onRawReady={(event) => {
            handleYouTubeReady(event);
            setIsReady(true);
          }}
          onRawStateChange={handleYouTubeStateChange}
        />
      )}

      {/* The YouTube player renders its own facade and spinner, so it's never
          waiting behind this one. */}
      {videoProvider === "mux" && !isReady && (
        <div className={styles.spinnerOverlay}>
          <div className={styles.spinner} />
        </div>
      )}
    </div>
  );
}
