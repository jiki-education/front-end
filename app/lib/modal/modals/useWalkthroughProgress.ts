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
    localStorage.setItem(getStorageKey(lessonSlug), String(currentTime));

    // Report every 1%
    const percentage = (currentTime / duration) * 100;
    reportProgress(percentage);
  };

  const handleVideoEnd = () => {
    reportProgress(100);
    localStorage.removeItem(getStorageKey(lessonSlug));
  };

  const handleCanPlay = () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    const savedTime = localStorage.getItem(getStorageKey(lessonSlug));
    if (savedTime) {
      const time = parseFloat(savedTime);
      if (time > 0 && time < (player.duration || Infinity)) {
        player.currentTime = time;
      }
    }
  };

  // Clean up ref on unmount (no need to clear storage — we want it to persist)
  useEffect(() => {
    return () => {
      lastReportedPercentRef.current = -1;
    };
  }, [lessonSlug]);

  return {
    playerRef,
    handleTimeUpdate,
    handleVideoEnd,
    handleCanPlay
  };
}
