import type { JikiVideoPlayerHandle } from "@/components/ui/JikiVideoPlayer";
import type { YTPlayer } from "@/components/youtube-player/JikiYouTubePlayer";
import type { VideoSource } from "@/types/lesson";
import { useEffect, useRef } from "react";
import { updateWalkthroughVideoPercentage } from "@/lib/api/lessons";

const STORAGE_KEY_PREFIX = "walkthrough-progress-";

function getStorageKey(lessonSlug: string): string {
  return `${STORAGE_KEY_PREFIX}${lessonSlug}`;
}

export function useWalkthroughProgress(lessonSlug: string, provider: VideoSource["provider"] = "mux") {
  const playerRef = useRef<JikiVideoPlayerHandle>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const lastReportedPercentRef = useRef(-1);
  const hasRestoredPositionRef = useRef(false);

  const reportProgress = (percentage: number) => {
    const rounded = Math.round(percentage);
    if (rounded === lastReportedPercentRef.current) {
      return;
    }
    lastReportedPercentRef.current = rounded;
    // Best-effort progress ping; the API client reports genuine /internal failures centrally.
    updateWalkthroughVideoPercentage(lessonSlug, rounded).catch(() => {});
  };

  // Shared by both providers: persist the resume point locally and report the
  // percentage upwards.
  const recordPosition = (currentTime: number, duration: number) => {
    if (!duration) {
      return;
    }

    // Save to local storage
    try {
      localStorage.setItem(getStorageKey(lessonSlug), String(currentTime));
    } catch {
      // Ignore — localStorage may be unavailable in private browsing or quota exceeded
    }

    // Report every 1%
    reportProgress((currentTime / duration) * 100);
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    recordPosition(player.currentTime || 0, player.duration || 0);
  };

  const handleVideoEnd = () => {
    reportProgress(100);
    try {
      localStorage.removeItem(getStorageKey(lessonSlug));
    } catch {
      // Ignore — localStorage may be unavailable in private browsing
    }
  };

  // Reads the stored resume point, or null when there's nothing to restore.
  const savedPosition = (duration: number): number | null => {
    try {
      const savedTime = localStorage.getItem(getStorageKey(lessonSlug));
      if (!savedTime) {
        return null;
      }
      const time = parseFloat(savedTime);
      return time > 0 && time < duration ? time : null;
    } catch {
      // Ignore — localStorage may be unavailable in private browsing
      return null;
    }
  };

  // Wired to both `loadedmetadata` and `canplay` so a restore that can't run yet
  // (no duration) is retried rather than lost. Guarded to run at most once.
  const restorePosition = () => {
    if (hasRestoredPositionRef.current) {
      return;
    }

    const player = playerRef.current;
    if (!player) {
      return;
    }

    // Seeking before metadata is ready defers the write inside the player until
    // `loadedmetadata`, so don't burn the guard yet — retry on the next event.
    const duration = player.duration || 0;
    if (!duration) {
      return;
    }

    hasRestoredPositionRef.current = true;

    const time = savedPosition(duration);
    if (time !== null) {
      player.currentTime = time;
    }
  };

  const restoreYouTubePosition = (player: YTPlayer) => {
    if (hasRestoredPositionRef.current) {
      return;
    }

    // Duration isn't available until the video has loaded — retry on a later event.
    const duration = player.getDuration();
    if (!duration) {
      return;
    }

    hasRestoredPositionRef.current = true;

    const time = savedPosition(duration);
    if (time !== null) {
      player.seekTo(time, true);
    }
  };

  const handleYouTubeReady = (event: { target: YTPlayer }) => {
    ytPlayerRef.current = event.target;
    restoreYouTubePosition(event.target);
  };

  const handleYouTubeStateChange = (event: { data: number; target: YTPlayer }) => {
    // YT.PlayerState: ENDED=0, PLAYING=1
    if (event.data === 0) {
      handleVideoEnd();
    } else if (event.data === 1) {
      restoreYouTubePosition(event.target);
      recordPosition(event.target.getCurrentTime(), event.target.getDuration());
    }
  };

  // YouTube has no native timeupdate event — poll while the player is mounted.
  useEffect(() => {
    if (provider !== "youtube" || typeof window === "undefined") {
      return;
    }
    const interval = window.setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player) {
        return;
      }
      recordPosition(player.getCurrentTime(), player.getDuration());
    }, 1000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, lessonSlug]);

  // Clean up refs on unmount (no need to clear storage — we want it to persist)
  useEffect(() => {
    return () => {
      lastReportedPercentRef.current = -1;
      hasRestoredPositionRef.current = false;
    };
  }, [lessonSlug]);

  return {
    playerRef,
    handleTimeUpdate,
    handleVideoEnd,
    restorePosition,
    handleYouTubeReady,
    handleYouTubeStateChange
  };
}
