import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { useEffect, useRef } from "react";
import { updateWalkthroughVideoPercentage } from "@/lib/api/lessons";

const STORAGE_KEY_PREFIX = "walkthrough-progress-";

function getStorageKey(lessonSlug: string): string {
  return `${STORAGE_KEY_PREFIX}${lessonSlug}`;
}

export function useWalkthroughProgress(lessonSlug: string) {
  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const lastReportedPercentRef = useRef(-1);
  const hasRestoredPositionRef = useRef(false);

  const reportProgress = (percentage: number) => {
    const rounded = Math.round(percentage);
    if (rounded === lastReportedPercentRef.current) {
      return;
    }
    lastReportedPercentRef.current = rounded;
    updateWalkthroughVideoPercentage(lessonSlug, rounded).catch(() => {});
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const currentTime = player.currentTime || 0;
    const duration = player.duration || 0;
    if (duration === 0) {
      return;
    }

    // Save to local storage
    try {
      localStorage.setItem(getStorageKey(lessonSlug), String(currentTime));
    } catch {
      // Ignore — localStorage may be unavailable in private browsing or quota exceeded
    }

    // Report every 1%
    const percentage = (currentTime / duration) * 100;
    reportProgress(percentage);
  };

  const handleVideoEnd = () => {
    reportProgress(100);
    try {
      localStorage.removeItem(getStorageKey(lessonSlug));
    } catch {
      // Ignore — localStorage may be unavailable in private browsing
    }
  };

  const handleCanPlay = () => {
    if (hasRestoredPositionRef.current) {
      return;
    }

    const player = playerRef.current;
    if (!player) {
      return;
    }

    hasRestoredPositionRef.current = true;

    try {
      const savedTime = localStorage.getItem(getStorageKey(lessonSlug));
      if (savedTime) {
        const time = parseFloat(savedTime);
        if (time > 0 && time < (player.duration || Infinity)) {
          player.currentTime = time;
        }
      }
    } catch {
      // Ignore — localStorage may be unavailable in private browsing
    }
  };

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
    handleCanPlay
  };
}
