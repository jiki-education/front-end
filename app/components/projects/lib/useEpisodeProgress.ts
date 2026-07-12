import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { useEffect, useRef, useState } from "react";
import { fetchUserVideo, updateUserVideoPercentage, type UserVideoData } from "@/lib/api/user-videos";
import { useAuthStore } from "@/lib/auth/authStore";
import { reportError } from "@/lib/reportError";

interface ProgressPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number) => void;
}

export function useEpisodeProgress(uuid: string, videoProvider?: "mux" | "youtube") {
  const muxPlayerRef = useRef<MuxPlayerRefAttributes>(null);
  const ytPlayerRef = useRef<ProgressPlayer | null>(null);
  const lastReportedPercentRef = useRef(-1);
  const hasRestoredPositionRef = useRef(false);
  const [userVideo, setUserVideo] = useState<UserVideoData | null>(null);
  const userVideoLoadedRef = useRef(false);

  // Progress is per-user state: logged-out visitors (episodes are public
  // pages) get no fetch and no reporting.
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;

  // Reset all internal state when the uuid changes (e.g. client-side
  // navigation between episodes without a remount).
  useEffect(() => {
    hasRestoredPositionRef.current = false;
    lastReportedPercentRef.current = -1;
    userVideoLoadedRef.current = false;
    ytPlayerRef.current = null;
    setUserVideo(null);

    if (!isLoggedIn) {
      return;
    }

    let cancelled = false;
    void fetchUserVideo(uuid).then((data) => {
      if (cancelled) {
        return;
      }
      userVideoLoadedRef.current = true;
      setUserVideo(data);
    });
    return () => {
      cancelled = true;
    };
  }, [uuid, isLoggedIn]);

  const reportProgress = (percentage: number) => {
    if (!isLoggedIn) {
      return;
    }
    const rounded = Math.round(percentage);
    if (rounded === lastReportedPercentRef.current) {
      return;
    }
    lastReportedPercentRef.current = rounded;
    updateUserVideoPercentage(uuid, rounded).catch(reportError);
  };

  const reportFromPlayer = (player: ProgressPlayer | null) => {
    if (!player) {
      return;
    }
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    if (!duration) {
      return;
    }
    reportProgress((currentTime / duration) * 100);
  };

  const restorePosition = (player: ProgressPlayer) => {
    if (hasRestoredPositionRef.current || !userVideoLoadedRef.current) {
      return;
    }
    if (!userVideo) {
      hasRestoredPositionRef.current = true;
      return;
    }
    if (userVideo.status === "completed" || userVideo.watched_percentage >= 100) {
      hasRestoredPositionRef.current = true;
      return;
    }
    const duration = player.getDuration();
    if (!duration) {
      // Duration not yet available — try again on the next event.
      return;
    }
    hasRestoredPositionRef.current = true;
    const targetPercentage = Math.max(0, userVideo.watched_percentage - 1);
    player.seekTo((targetPercentage / 100) * duration);
  };

  // Mux handlers
  const handleMuxTimeUpdate = () => {
    const p = muxPlayerRef.current;
    if (!p) {
      return;
    }
    const currentTime = p.currentTime || 0;
    const duration = p.duration || 0;
    if (!duration) {
      return;
    }
    reportProgress((currentTime / duration) * 100);
  };

  const handleMuxEnded = () => reportProgress(100);

  const handleMuxLoadedMetadata = () => {
    const p = muxPlayerRef.current;
    if (!p) {
      return;
    }
    restorePosition({
      getCurrentTime: () => p.currentTime || 0,
      getDuration: () => p.duration || 0,
      seekTo: (seconds: number) => {
        p.currentTime = seconds;
      }
    });
  };

  // YouTube handlers
  const handleYouTubeReady = (event: { target: ProgressPlayer & { seekTo: (s: number, b: boolean) => void } }) => {
    const target = event.target;
    ytPlayerRef.current = {
      getCurrentTime: () => target.getCurrentTime(),
      getDuration: () => target.getDuration(),
      seekTo: (s: number) => target.seekTo(s, true)
    };
    restorePosition(ytPlayerRef.current);
  };

  const handleYouTubeStateChange = (event: { data: number; target: ProgressPlayer }) => {
    // YT.PlayerState: ENDED=0, PLAYING=1, BUFFERING=3
    if (event.data === 0) {
      reportProgress(100);
    } else if (event.data === 1) {
      // Once playing, duration is available — restore if we haven't yet.
      if (!hasRestoredPositionRef.current && ytPlayerRef.current) {
        restorePosition(ytPlayerRef.current);
      }
      reportFromPlayer(event.target);
    }
  };

  // YouTube has no native timeupdate event — poll while playing.
  // Keyed on uuid as well so the interval is torn down between episodes
  // (otherwise we'd report old-player progress against the new uuid).
  useEffect(() => {
    if (videoProvider !== "youtube" || typeof window === "undefined") {
      return;
    }
    const interval = window.setInterval(() => {
      reportFromPlayer(ytPlayerRef.current);
    }, 1000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoProvider, uuid]);

  // Re-attempt restore once the user video data arrives (in case the player was
  // already ready before the API call resolved).
  useEffect(() => {
    if (!userVideo || hasRestoredPositionRef.current) {
      return;
    }
    if (muxPlayerRef.current) {
      handleMuxLoadedMetadata();
    } else if (ytPlayerRef.current) {
      restorePosition(ytPlayerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userVideo]);

  return {
    muxPlayerRef,
    handleMuxTimeUpdate,
    handleMuxEnded,
    handleMuxLoadedMetadata,
    handleYouTubeReady,
    handleYouTubeStateChange
  };
}
