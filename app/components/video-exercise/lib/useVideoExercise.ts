import { markLessonComplete, fetchUserLesson } from "@/lib/api/lessons";
import { reportError } from "@/lib/reportError";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Tolerance (in seconds) added to the max-watched ceiling so that the natural
// granularity of `timeupdate` events doesn't fight a user resuming playback.
const SEEK_TOLERANCE_SECONDS = 0.5;

// How long the "can't skip ahead" hint stays visible after a blocked seek.
const SKIP_HINT_DURATION_MS = 2500;

export function useVideoExercise(lessonSlug: string) {
  const router = useRouter();
  const [videoWatched, setVideoWatched] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  // On a first watch, forward seeking is capped at the furthest point reached
  // so far (tracked in `maxWatchedRef`, read synchronously inside the seek
  // handler). Once the video has been watched the cap is lifted and the full
  // bar becomes scrubbable. The purple progress bar is the only persistent cue;
  // `showSkipHint` surfaces a transient message the moment a skip is blocked,
  // so the snap-back never looks unexplained.
  const [showSkipHint, setShowSkipHint] = useState(false);
  const maxWatchedRef = useRef(0);
  const skipHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (skipHintTimeoutRef.current) {
        clearTimeout(skipHintTimeoutRef.current);
      }
    };
  }, []);

  const handleAutoplayFailure = (error: Error) => {
    const expected = error.name === "NotAllowedError" || error.name === "AbortError";
    if (!expected) reportError(error);
    console.warn("Autoplay was prevented:", error.message);
    setIsVideoVisible(true);
  };

  useEffect(() => {
    fetchUserLesson(lessonSlug)
      .then((userLesson) => {
        if (userLesson.status === "completed") {
          setIsAlreadyCompleted(true);
          setVideoWatched(true);
          setVideoProgress(100);
          setShowCheckmark(true);
          // Subsequent watches get a normal, fully-scrubbable seek bar.
          maxWatchedRef.current = Infinity;
        }
      })
      .catch(reportError);

    setIsInitializing(false);
  }, [lessonSlug]);

  const handleVideoEnd = () => {
    if (isAlreadyCompleted) {
      return;
    }
    setVideoWatched(true);
    setVideoProgress(100);
    // The whole video has now been watched, so lift the seek cap.
    maxWatchedRef.current = Infinity;
    setTimeout(() => setShowCheckmark(true), 100);
  };

  const handleVideoPlay = () => setIsVideoVisible(true);

  const handleTimeUpdate = () => {
    if (isAlreadyCompleted || videoWatched || !playerRef.current) {
      return;
    }
    const currentTime = playerRef.current.currentTime || 0;
    const duration = playerRef.current.duration || 1;
    setVideoProgress(Math.min((currentTime / duration) * 100, 100));

    // Advance the watched ceiling only during natural playback — scrubbing
    // forward must never raise it. `timeupdate` fires for both, but a
    // scrub past the cap is snapped back by `handleSeeking` before it can
    // reach here, so this only ever sees legitimately-reached positions.
    if (currentTime > maxWatchedRef.current) {
      maxWatchedRef.current = currentTime;
    }
  };

  const flashSkipHint = () => {
    setShowSkipHint(true);
    if (skipHintTimeoutRef.current) {
      clearTimeout(skipHintTimeoutRef.current);
    }
    skipHintTimeoutRef.current = setTimeout(() => setShowSkipHint(false), SKIP_HINT_DURATION_MS);
  };

  // On a first watch, clamp seeks to the furthest-watched point. Reading and
  // resetting `currentTime` synchronously inside `seeking` snaps the handle
  // back before the player commits to the new position, and surfaces a brief
  // hint so the snap-back is explained rather than mysterious.
  const handleSeeking = () => {
    if (isAlreadyCompleted || videoWatched || !playerRef.current) {
      return;
    }
    const ceiling = maxWatchedRef.current + SEEK_TOLERANCE_SECONDS;
    if (playerRef.current.currentTime > ceiling) {
      playerRef.current.currentTime = maxWatchedRef.current;
      flashSkipHint();
    }
  };

  const autoplay = () => {
    if (hasAutoPlayedRef.current || !playerRef.current) return;
    hasAutoPlayedRef.current = true;
    playerRef.current.play().catch(handleAutoplayFailure);
  };

  const handleContinue = async () => {
    if (isMarking) {
      return;
    }
    if (isAlreadyCompleted) {
      router.push(`/dashboard`);
      return;
    }
    try {
      setIsMarking(true);
      const response = await markLessonComplete(lessonSlug);
      const unlockedEvent = response?.meta?.events?.find((e: any) => e.type === "lesson_unlocked");
      const unlocked = unlockedEvent?.data?.lesson_slug;
      router.push(
        unlocked ? `/dashboard?completed=${lessonSlug}&unlocked=${unlocked}` : `/dashboard?completed=${lessonSlug}`
      );
    } catch (error) {
      reportError(error);
    } finally {
      setIsMarking(false);
    }
  };

  return {
    playerRef,
    videoWatched,
    isVideoVisible,
    isMarking,
    videoProgress,
    isInitializing,
    showCheckmark,
    isAlreadyCompleted,
    showSkipHint,
    handleVideoEnd,
    handleVideoPlay,
    handleTimeUpdate,
    handleSeeking,
    autoplay,
    handleContinue
  };
}
